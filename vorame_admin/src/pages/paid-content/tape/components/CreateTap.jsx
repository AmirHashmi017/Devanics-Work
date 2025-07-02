import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Box,
    Grid
} from "@mui/material";
import { useQueryClient } from "react-query";
import { CustomButton, CustomTextField } from "components";
import { TAPE } from "services/constants";
import { toast } from "react-toastify";
import ErrorMsg from "components/ErrorMsg";
import useApiMutation from "hooks/useApiMutation";
import QuillEditor from "components/QuillEditor/QuillEditor";
import CustomDropZone from "components/DropZone/CustomDropzone";
import AwsS3 from "utils/S3Intergration";

const CreateTape = ({ setOpen, tapeData = null }) => {
    const queryClient = useQueryClient();
    const { mutate, isLoading } = useApiMutation();
    const [loading, setLoading] = useState(false);

    const fetchTapes = () => queryClient.invalidateQueries({ queryKey: "tapes" });

    const handleSuccess = ({ message }) => {
        setOpen(false);
        toast.success(message);
        fetchTapes();
    };
    const initalValues = {
        title: tapeData?.title || "",
        description: tapeData?.description || "",
        thumbnail: tapeData?.thumbnail || [],
        video: tapeData?.video || [],
    };

    const validationSchema = yup.object().shape({
        title: yup.string().required("Title is required"),
        description: yup.string().required("Description is required"),
        video: yup.array().min(1, "At least one video is required"),
        thumbnail: yup.array().min(1, "At least one thumbnail is required"),
    });

    const { setFieldValue, values, handleSubmit, errors } = useFormik({
        initialValues: initalValues,
        validationSchema: validationSchema,
        onSubmit: async ({ video, thumbnail, title, description }) => {
            const videoData = [];
            const thumbnailData = [];

            try {
                setLoading(true);
                for (let i = 0; i < video.length; i++) {
                    const { type, name } = video[i];
                    const url = await new AwsS3(video[i], "images/").getS3URL();
                    videoData.push({
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    })
                }

                for (let i = 0; i < thumbnail.length; i++) {
                    const { type, name } = thumbnail[i];
                    const url = await new AwsS3(thumbnail[i], "images/").getS3URL();
                    thumbnailData.push({
                        url,
                        type,
                        extension: type.split('/')[1],
                        name,
                    })

                }


            } catch (error) {
                console.log('something went wrong', error);
                toast.error('Some error happended while uploading');

            } finally {
                setLoading(false)
            }

            if (videoData.length < 1 || thumbnailData.length < 1) {
                return;
            }

            const tapeValues = { video: videoData, thumbnail: thumbnailData, title, description }
            mutate(
                {
                    url: TAPE + (tapeData ? 'update' : "create"),
                    data: tapeData ? { ...tapeValues, id: tapeData._id } : tapeValues
                },
                {
                    onSuccess: handleSuccess,
                }
            );
        },
    });
    const { title, description, thumbnail, video } = values;

    return (
        <form onSubmit={handleSubmit}>
            <CustomDropZone name='video' type='video' handleFileChange={(files) => setFieldValue('video', files)} />
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
                            <CustomDropZone type='thumbnail' handleFileChange={(files) => setFieldValue('thumbnail', files)} />
                        </Grid>
                    </Grid>
                    {errors.thumbnail && <ErrorMsg error={errors.thumbnail} />}
                </Box>
                <Box display="flex" justifyContent="space-between">
                    <CustomButton disabled={isLoading || loading} onClick={() => setOpen(false)}>
                        Cancel
                    </CustomButton>
                    <CustomButton disabled={isLoading || loading} type="submit">
                        {tapeData ? "Update" : "Add"} {(isLoading || loading) && "..."}
                    </CustomButton>
                </Box>
            </Box>
        </form>
    );
};

export default CreateTape;
