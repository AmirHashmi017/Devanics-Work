import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "react-query";
import { Grid, Typography, IconButton, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Button } from "@mui/material";
import AwsS3 from "utils/S3Intergration";
import ClipApi from "../../../services/api/clip";
import {
  CustomButton,
  ConfirmDialog,
  CustomBadge,
  CustomStatusDialog,
  CustomFormDialog,
  CustomLoader,
} from "../../../components/index";
import { clipInitialValues, addClipFormElements } from "../../../constants";
import { clipValidationSchema } from "../../../utils/validation";

import { StyledVideo, StyledCardMedia, StyledMediaIcon } from "./style";
import { StyledCard } from "theme/styles";
import CustomDescriptionParser from "components/DescriptionParser";
import FixedBox from "components/FixedBox";

const Clips = () => {
  const [clipID, setClipID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  // Video Progress
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // State to track which video is playing
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef([]);

  // Get clip list
  const {
    data: clipList,
    refetch,
    isLoading,
  } = useQuery("CLIP_LIST", () => ClipApi.getClips());

  // Get single clip
  const { data: singleClip } = useQuery(
    ["SINGLE_CLIP", clipID],
    () => ClipApi.getSingleClip({ id: clipID }),
    {
      enabled: !!clipID,
    }
  );

  // Update clip status mutation
  const updateStatusMutation = useMutation(
    (data) => ClipApi.updateClipStatus(data),
    {
      onSuccess: () => {
        toast.success("Status updated successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update status.");
      },
    }
  );

  // Update clip favourite mutation
  const updateFavoriteMutation = useMutation(
    (data) => ClipApi.updateClipFavourite(data),
    {
      onSuccess: () => {
        toast.success("Favorite status updated successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update favorite status.");
      },
    }
  );

  // Create and update blog mutation
  const { mutate: Clips, isLoading: clipMutationLoadin } = useMutation(
    (body) => {
      if (clipID) {
        const updatedBody = { ...body, id: clipID };
        return ClipApi.updateClip(updatedBody);
      } else {
        return ClipApi.createClip(body);
      }
    },
    {
      onSuccess: (res) => {
        if (res?.statusCode === 201 || res?.statusCode === 200) {
          toast.success(res?.message);
          refetch();
          handleClose();
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  // Set form values on update

  useEffect(() => {
    if (singleClip) {
      formik.setFieldValue("title", singleClip?.findClip?.title);
      formik.setFieldValue("description", singleClip?.findClip?.description);

      setVideoPreview(singleClip?.findClip?.video[0]?.url);
      setImagePreview(singleClip?.findClip?.thumbnail[0]?.url);

      // Set image file
      const imageFile = {
        url: singleClip?.findClip?.thumbnail[0]?.url,
        type: singleClip?.findClip?.thumbnail[0]?.type,
        extension: singleClip?.findClip?.thumbnail[0]?.extension,
        name: singleClip?.findClip?.thumbnail[0]?.name,
      };

      // Set Video file
      const videoFile = {
        url: singleClip?.findClip?.video[0]?.url,
        type: singleClip?.findClip?.video[0]?.type,
        extension: singleClip?.findClip?.video[0]?.extension,
        name: singleClip?.findClip?.video[0]?.name,
      };

      formik.setFieldValue("thumbnail", [imageFile]);
      formik.setFieldValue("video", [videoFile]);
    }
  }, [singleClip]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete blog api
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await ClipApi.deleteClip(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Clip not deleted!");
    }
  };

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setClipID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update blog  status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: clipID, status });
    setDialogOpen(false);
  };

  // Handle update blog favourite method
  const handleFavoriteUpdate = (blog) => {
    updateFavoriteMutation.mutate({
      id: blog?._id,
      favourite: !blog?.favourite,
    });
  };

  // Formik
  const formik = useFormik({
    initialValues: clipInitialValues,
    validationSchema: clipValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle File change
  const handleFileChange = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    const fileUrl = URL.createObjectURL(file);

    if (fileType.startsWith("image/")) {
      let url;
      try {
        url = await new AwsS3(file, "images/").getS3URLWithProgress(
          (progress) => {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
            setImageProgress(percent);
          }
        );
      } catch (error) {
        console.log("Error in image upload in s3 ===>", error);
      }

      console.log("Image s3 url :", url);

      const newFile = {
        url: url,
        type: fileType,
        extension: fileExtension,
        name: fileName,
      };
      formik.setFieldValue("thumbnail", [...formik.values.thumbnail, newFile]);
      setImagePreview(fileUrl);
    } else if (fileType.startsWith("video/")) {
      const url = await new AwsS3(file, "videos/").getS3URLWithProgress(
        (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setVideoProgress(percent);
        }
      );
      const newFile = {
        url: url,
        type: fileType,
        extension: fileExtension,
        name: fileName,
      };
      formik.setFieldValue("video", [...formik.values.video, newFile]);
      setVideoPreview(fileUrl);
    }
  };

  // Handle blog form submit
  const handleSubmit = async (values) => {
    Clips(values);
  };

  // Open add blog
  const handleClickOpen = (id) => {
    if (id) {
      setClipID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add blog
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setClipID(null);
    setImagePreview(null);
    setVideoPreview(null);
    setImageProgress(0);
    setVideoProgress(0);
  };

  // Handle play pause videos
  const handleVideoClick = (index) => {
    if (playingIndex !== null && playingIndex !== index) {
      videoRefs.current[playingIndex].pause();
    }
    const video = videoRefs.current[index];
    if (video.paused) {
      video.play();
      setPlayingIndex(index);
    } else {
      video.pause();
      setPlayingIndex(null);
    }
  };

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          <Grid container mt={3}>
            <Grid item xs={6}>
              <Typography sx={{ fontSize: "24px", fontWeight: 600 }}>
                Clips
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleClickOpen(null)}
                sx={{
                  backgroundColor: "#010D19",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: "8px",
                  boxShadow: "none",
                  px: 2.5,
                  fontSize: "16px",
                  "&:hover": {
                    backgroundColor: "#010D19",
                  },
                }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          {clipList && clipList.length > 0 ? (
            <Grid container spacing="10px" sx={{ overflowY: "auto", mt: 1 }}>
              {clipList.map((clip, index) => (
                <Grid item lg={3.5} md={6} key={index}>
                  <StyledCard>
                    <Box sx={{ flexGrow: 1 }}>
                      <StyledCardMedia>
                        {/* Video */}
                        <StyledVideo
                          key={clip?.video[0]?.url}
                          ref={(el) => (videoRefs.current[index] = el)}
                          onClick={() => handleVideoClick(index)}
                          controls
                        >
                          <source src={clip?.video[0]?.url} type="video/mp4" />
                        </StyledVideo>

                        {/* Play/Pause Icon Overlay */}
                        <StyledMediaIcon
                          onClick={() => handleVideoClick(index)}
                        >
                          {playingIndex === index ? (
                            <img src={`icons/pause.svg`} alt="Play" />
                          ) : (
                            <img src={`icons/play.svg`} alt="Pause" />
                          )}
                        </StyledMediaIcon>
                      </StyledCardMedia>
                      <Box p={1.5}>
                        <FixedBox>
                          <Typography
                            overflow="hidden"
                            sx={{
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          >
                            {clip.title}
                          </Typography>
                        </FixedBox>

                        <FixedBox>
                          <CustomDescriptionParser
                            description={clip?.description}
                            limit={2}
                          />
                        </FixedBox>
                        <Box
                          display="flex"
                          gap={2}
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <CustomBadge
                            badgeContent={clip?.status}
                            onClick={() => handleBadgeClick(clip)}
                          />
                          <Box display="flex">
                            <IconButton
                              aria-label="start"
                              onClick={() => handleFavoriteUpdate(clip)}
                            >
                              {clip?.favourite === true ? (
                                <img
                                  src={`icons/star-active.svg`}
                                  alt="star-active"
                                />
                              ) : (
                                <img src={`icons/star.svg`} alt="star" />
                              )}
                            </IconButton>
                            <IconButton
                              aria-label="edit"
                              onClick={() => handleClickOpen(clip?._id)}
                            >
                              <img src={`icons/edit.svg`} alt="edit" />
                            </IconButton>
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleConfirmOpen(clip?._id)}
                              sx={{ marginRight: 1 }}
                            >
                              <img src={`icons/trash.svg`} alt="delete" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                Currently clips not exists.
              </Typography>
            </Grid>
          )}
          <Grid>
            <ConfirmDialog
              title="Delete Clip ?"
              dialogContext="Are you sure to delete clip ?"
              open={confirmOpen}
              setOpen={setConfirmOpen}
              onConfirm={handleDelete}
            />
            <CustomStatusDialog
              open={dialogOpen}
              onClose={() => setDialogOpen(false)}
              onUpdate={handleUpdateStatus}
              status={status}
              setStatus={setStatus}
            />
          </Grid>
          {/* Add blog grid */}
          <CustomFormDialog
            dialogTitle={clipID ? "Update Clip" : "Add Clip"}
            open={openFormDialog}
            onClose={handleClose}
            formik={formik}
            handleFileChange={handleFileChange}
            formElements={addClipFormElements}
            id={clipID}
            loading={clipMutationLoadin}
            videoProgress={videoProgress}
            setVideoProgress={setVideoProgress}
            imageProgress={imageProgress}
            setImageProgress={setImageProgress}
            videoPreview={videoPreview}
            setVideoPreview={setVideoPreview}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </>
      )}
    </>
  );
};

export default Clips;
