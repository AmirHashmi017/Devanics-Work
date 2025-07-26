import React, { useState } from "react";
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
    const [loading, setLoading] = useState(false);
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
            try {
                setLoading(true);
                // Only upload new files if they are File objects (not already uploaded URLs)
                videoData = await Promise.all(videoData.map(async (file) => {
                    if (file.url) return file;
                    const { type, name } = file;
                    const url = await new AwsS3(file, "images/").getS3URLWithProgress(
                        (progress) => {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            setVideoProgress(percent);
                        }
                    );
                    setVideoProgress(0); // Reset after upload
                    return {
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    };
                }));
                thumbnailData = await Promise.all(thumbnailData.map(async (file) => {
                    if (file.url) return file;
                    const { type, name } = file;
                    const url = await new AwsS3(file, "images/").getS3URLWithProgress(
                        (progress) => {
                            const percent = Math.round((progress.loaded / progress.total) * 100);
                            setThumbnailProgress(percent);
                        }
                    );
                    setThumbnailProgress(0); // Reset after upload
                    return {
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    };
                }));
                // Calculate duration for the first video (if present)
                if (videoData.length > 0) {
                    try {
                        duration = await getVideoDurationString(videoData[0]);
                    } catch (e) {
                        duration = "";
                    }
                }
            } catch (error) {
                console.log('something went wrong', error);
                toast.error('Some error happended while uploading');
            } finally {
                setLoading(false)
            }
            // Only require video/thumbnail on create
            if (!tranquilityData && (videoData.length < 1 || thumbnailData.length < 1)) {
                return;
            }
            const tranquilityValues = { video: videoData, thumbnail: thumbnailData, title, description, duration }
            if (tranquilityData) {
                const res = await TranquilityApi.updateTranquility(tranquilityData._id, tranquilityValues);
                setFieldValue('video', videoData, false);
                setFieldValue('thumbnail', thumbnailData, false);
                await handleSuccess(res);
            } else {
                const res = await TranquilityApi.createTranquility(tranquilityValues);
                setFieldValue('video', videoData, false);
                setFieldValue('thumbnail', thumbnailData, false);
                await handleSuccess(res);
            }
        },
    });
    const { title, description, thumbnail, video } = values;

    return (
        <form onSubmit={handleSubmit}>
            {videoProgress > 0 && videoProgress < 100 && (
                <UploadProgress value={videoProgress} />
            )}
            <CustomDropZone name='video' type='video' files={video} handleFileChange={(files) => setFieldValue('video', files)} />
            {errors.video && <ErrorMsg error={errors.video} />}
            <Box display="flex" flexDirection="column" gap="12px">
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
                <Box>
                    <Grid container>
                        <Grid item sm={6} md={4} spacing={2}>
                            {thumbnailProgress > 0 && thumbnailProgress < 100 && (
                                <UploadProgress value={thumbnailProgress} />
                            )}
                            <CustomDropZone type='thumbnail' files={thumbnail} handleFileChange={(files) => setFieldValue('thumbnail', files)} />
                        </Grid>
                    </Grid>
                    {errors.thumbnail && <ErrorMsg error={errors.thumbnail} />}
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <CustomButton disabled={loading} onClick={() => setOpen(false)}>
                        Cancel
                    </CustomButton>
                    <CustomButton disabled={loading} type="submit">
                        {tranquilityData ? "Update" : "Add"} {loading && "..."}
                    </CustomButton>
                </Box>
            </Box>
        </form>
    );
};

export default CreateTranquility;
