import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Box,
    Grid
} from "@mui/material";
import { useQueryClient } from "react-query";
import { CustomButton, CustomTextField } from "components";
import TranquilityApi from "services/api/tranquility";
import { toast } from "react-toastify";
import ErrorMsg from "components/ErrorMsg";
import QuillEditor from "components/QuillEditor/QuillEditor";
import CustomDropZone from "components/DropZone/CustomDropzone";
import AwsS3 from "utils/S3Intergration";
import UploadProgress from "components/UploadProgress";

// Helper to get video duration as mm:ss string
const getVideoDurationString = (file) => {
    return new Promise((resolve, reject) => {
        try {
            const url = file.url || URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.src = url;
            video.onloadedmetadata = () => {
                const duration = video.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                resolve(durationString);
            };
            video.onerror = (e) => reject(e);
        } catch (e) {
            reject(e);
        }
    });
};

const CreateTranquility = ({ setOpen, tranquilityData = null }) => {
    const queryClient = useQueryClient();
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [thumbnailProgress, setThumbnailProgress] = useState(0);

    const fetchTranquilities = () => queryClient.invalidateQueries({ queryKey: ["tranquilities"] });

    const handleSuccess = async ({ message }) => {
        await queryClient.invalidateQueries({ 
            predicate: (query) => query.queryKey[0] === "tranquilities" 
        });
        toast.success(message);
        setOpen(false);
    };
    
    const initalValues = {
        title: tranquilityData?.title || "",
        description: tranquilityData?.description || "",
        thumbnail: tranquilityData?.thumbnail || [],
        video: tranquilityData?.video || [],
    };

    const validationSchema = yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        video: tranquilityData ? yup.array() : yup.array().min(1, "At least one video is required"),
        thumbnail: tranquilityData ? yup.array() : yup.array().min(1, "At least one thumbnail is required"),
    });

    const { setFieldValue, values, handleSubmit, errors } = useFormik({
        initialValues: initalValues,
        validationSchema: validationSchema,
        onSubmit: async ({ video, thumbnail, title, description }) => {
            let videoData = Array.isArray(video) ? video : [];
            let thumbnailData = Array.isArray(thumbnail) ? thumbnail : [];
            let duration = "";
            
            // Only require video/thumbnail on create
            if (!tranquilityData && (videoData.length < 1 || thumbnailData.length < 1)) {
                return;
            }
            
            // Calculate duration for the first video (if present)
            if (videoData.length > 0) {
                try {
                    duration = await getVideoDurationString(videoData[0]);
                } catch (e) {
                    duration = "";
                }
            }
            
            setSubmitting(true);
            const tranquilityValues = { video: videoData, thumbnail: thumbnailData, title, description, duration }
            
            try {
                if (tranquilityData) {
                    const res = await TranquilityApi.updateTranquility(tranquilityData._id, tranquilityValues);
                    await handleSuccess(res);
                } else {
                    const res = await TranquilityApi.createTranquility(tranquilityValues);
                    await handleSuccess(res);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });
    
    const { title, description, thumbnail, video } = values;

    // Separate useEffect for video uploads
    useEffect(() => {
        const handleVideoUpload = async () => {
            const videoFiles = values.video.filter(file => file instanceof File);
            if (videoFiles.length === 0) return;
            
            setUploadingVideo(true);
            setVideoProgress(0);
            
            try {
                const uploadedVideos = await Promise.all(videoFiles.map(async (file) => {
                    const { type, name } = file;
                    const url = await new AwsS3(file, "images/").getS3URLWithProgress(
                        (progress) => {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            setVideoProgress(percent);
                        }
                    );
                    return {
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    };
                }));
                
                // Update existing videos with uploaded ones
                const existingVideos = values.video.filter(file => !(file instanceof File));
                setFieldValue('video', [...existingVideos, ...uploadedVideos], false);
            } catch (error) {
                console.log('Video upload error:', error);
                toast.error('Video upload failed');
            } finally {
                setUploadingVideo(false);
                setVideoProgress(0);
            }
        };
        
        handleVideoUpload();
    }, [values.video, setFieldValue]);

    // Separate useEffect for thumbnail uploads
    useEffect(() => {
        const handleThumbnailUpload = async () => {
            const thumbnailFiles = values.thumbnail.filter(file => file instanceof File);
            if (thumbnailFiles.length === 0) return;
            
            setUploadingThumbnail(true);
            setThumbnailProgress(0);
            
            try {
                const uploadedThumbnails = await Promise.all(thumbnailFiles.map(async (file) => {
                    const { type, name } = file;
                    const url = await new AwsS3(file, "images/").getS3URLWithProgress(
                        (progress) => {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            setThumbnailProgress(percent);
                        }
                    );
                    return {
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    };
                }));
                
                // Update existing thumbnails with uploaded ones
                const existingThumbnails = values.thumbnail.filter(file => !(file instanceof File));
                setFieldValue('thumbnail', [...existingThumbnails, ...uploadedThumbnails], false);
            } catch (error) {
                console.log('Thumbnail upload error:', error);
                toast.error('Thumbnail upload failed');
            } finally {
                setUploadingThumbnail(false);
                setThumbnailProgress(0);
            }
        };
        
        handleThumbnailUpload();
    }, [values.thumbnail, setFieldValue]);

    // Reset upload states when files are removed
    useEffect(() => {
        const videoFiles = values.video.filter(file => file instanceof File);
        if (videoFiles.length === 0 && uploadingVideo) {
            setUploadingVideo(false);
            setVideoProgress(0);
        }
    }, [values.video, uploadingVideo]);

    useEffect(() => {
        const thumbnailFiles = values.thumbnail.filter(file => file instanceof File);
        if (thumbnailFiles.length === 0 && uploadingThumbnail) {
            setUploadingThumbnail(false);
            setThumbnailProgress(0);
        }
    }, [values.thumbnail, uploadingThumbnail]);

    const isUploading = uploadingVideo || uploadingThumbnail;

    return (
        <form onSubmit={handleSubmit}>
            {/* Video Section with its own progress */}
            <Box>
                {uploadingVideo && videoProgress > 0 && videoProgress < 100 && (
                    <Box mb={2}>
                        <UploadProgress value={videoProgress} label="Video is uploading..." />
                    </Box>
                )}
                
                <CustomDropZone 
                    name='video' 
                    type='video' 
                    files={video} 
                    handleFileChange={(files) => setFieldValue('video', files)}
                    disabled={uploadingVideo}
                />
                {errors.video && <ErrorMsg error={errors.video} />}
            </Box>
            
            <Box display="flex" flexDirection="column" gap="12px" mt={2}>
                <div>
                    <Box
                        component="label"
                        htmlFor="title"
                        fontSize="14px"
                        fontWeight="500"
                    >
                        Title
                    </Box>
                    <Box mt="6px">
                        <CustomTextField
                            size="small"
                            name="title"
                            id="title"
                            value={title}
                            placeholder="Enter Title"
                            type="text"
                            onChange={({ target }) => setFieldValue("title", target.value)}
                        />
                    </Box>
                    {errors.title && <ErrorMsg error={errors.title} />}
                </div>
                
                <Box>
                    <QuillEditor
                        name="description"
                        value={description}
                        onChange={(value) => setFieldValue("description", value)}
                    />
                    {errors.description && <ErrorMsg error={errors.description} />}
                </Box>
                
                {/* Thumbnail Section with its own progress */}
                <Box>
                    <Grid container>
                        <Grid item sm={6} md={4} spacing={2}>
                            <Box>
                                {uploadingThumbnail && thumbnailProgress > 0 && thumbnailProgress < 100 && (
                                    <Box mb={2}>
                                        <UploadProgress value={thumbnailProgress} label="Thumbnail is uploading..." />
                                    </Box>
                                )}
                                
                                <CustomDropZone 
                                    type='thumbnail' 
                                    files={thumbnail} 
                                    handleFileChange={(files) => setFieldValue('thumbnail', files)}
                                    disabled={uploadingThumbnail}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    {errors.thumbnail && <ErrorMsg error={errors.thumbnail} />}
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                    <CustomButton disabled={isUploading || submitting} onClick={() => setOpen(false)}>
                        Cancel
                    </CustomButton>
                    <CustomButton disabled={isUploading || submitting} type="submit">
                        {uploadingVideo ? "Uploading Video..." : 
                         uploadingThumbnail ? "Uploading Thumbnail..." : 
                         submitting ? "Saving..." : 
                         (tranquilityData ? "Update" : "Add")}
                    </CustomButton>
                </Box>
            </Box>
        </form>
    );
};

export default CreateTranquility;