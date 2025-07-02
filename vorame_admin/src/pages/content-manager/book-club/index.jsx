import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Grid, Typography, IconButton, Box } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import AwsS3 from "utils/S3Intergration";
import { getPdfFirstPageImage } from "../../../utils/getFirstPageAsImage";
import base64ToFile from "../../../utils/base64ToFile";
import BookClubApi from "../../../services/api/book-club";
import {
  CustomButton,
  ConfirmDialog,
  CustomBadge,
  CustomStatusDialog,
  CustomFormDialog,
  CustomLoader,
} from "../../../components";
import { bookInitialValues, addBookFormElements } from "../../../constants";
import { bookValidationSchema } from "../../../utils/validation";
import { StyledCardMedia } from "./style";
import { StyledCard } from "theme/styles";
import DescriptionParser from "../library/components/DescriptionParser";
import CustomDescriptionParser from "components/DescriptionParser";

const BookClub = () => {
  const [bookID, setBookID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [bookClubs, setBookClubs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [base64Image, setBase64Image] = useState(null);

  // Get book club list
  const { isLoading, refetch } = useQuery(
    "BOOk_LIST",
    () => BookClubApi.getBookClubs(),
    {
      onSuccess: async (res) => {
        setBookClubs(res);
      },
    }
  );

  // Get single book club
  const { data: singleBook } = useQuery(
    ["SINGLE_BOOK", bookID],
    () => BookClubApi.getSingleBookClub({ id: bookID }),
    {
      enabled: !!bookID,
    }
  );

  // Update book club status mutation
  const updateStatusMutation = useMutation(
    (data) => BookClubApi.updateBookClubStatus(data),
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

  // Update book club favourite mutation
  const updateFavoriteMutation = useMutation(
    (data) => BookClubApi.updateBookClubFavourite(data),
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

  // Create and update book club mutation
  const { mutate: BookClub } = useMutation(
    (body) => {
      if (bookID) {
        const updatedBody = { ...body, id: bookID };
        return BookClubApi.updateBookClub(updatedBody);
      } else {
        return BookClubApi.createBookClub(body);
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
    if (singleBook) {
      formik.setFieldValue("title", singleBook?.findBook?.title);
      setImagePreview(singleBook?.findBook?.file[0]?.url);

      // Set image
      const newFile = {
        url: singleBook?.findBook?.file[0]?.url,
        type: singleBook?.findBook?.file[0]?.type,
        extension: singleBook?.findBook?.file[0]?.extension,
        name: singleBook?.findBook?.file[0]?.name,
      };

      formik.setFieldValue("file", [newFile]);
    }
  }, [singleBook]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete book club
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await BookClubApi.deleteBookClub(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Blog not deleted!");
    }
  };

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setBookID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update book club status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: bookID, status });
    setDialogOpen(false);
  };

  // Handle update book club favourite method
  const handleFavoriteUpdate = (blog) => {
    updateFavoriteMutation.mutate({
      id: blog?._id,
      favourite: !blog?.favourite,
    });
  };

  // Formik
  const formik = useFormik({
    initialValues: bookInitialValues,
    validationSchema: bookValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle File change
  const handleFileChange = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    const base64Img = await getPdfFirstPageImage(file);
    setBase64Image(base64Img);
    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    const fileUrl = URL.createObjectURL(file);

    // Progress;
    const url = await new AwsS3(file, "bookclub/").getS3URLWithProgress(
      (progress) => {
        // calculate progress upto 100%
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setImageProgress(percent);
      }
    );

    setImagePreview(fileUrl);
    const newFile = {
      url: url,
      type: fileType,
      extension: fileExtension,
      name: fileName,
    };

    formik.setFieldValue("file", [...formik.values.file, newFile]);
  };

  // Handle blog form submit
  const handleSubmit = async (values) => {
    setLoading(true);
    let s3Url;
    try {
      // const base64Image = await getFirstPageAsImage(values?.file[0]?.url);
      const imageFile = base64ToFile(base64Image, values?.file[0]?.name);
      s3Url = await new AwsS3(imageFile, "bookclub/images/").getS3URL();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Upload file error:", error);
    }

    const body = { ...values, imageUrl: s3Url };
    // Calling mutation
    BookClub(body);
  };

  // Open add blog
  const handleClickOpen = (id) => {
    if (id) {
      setBookID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add blog
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setBookID(null);
    setImagePreview(null);
    setImageProgress(0);
  };

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          <Grid container sx={{ mb: 2, mt: 2 }}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontFamily: "Work Sans",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "34px",
                  letterSpacing: "0px",
                }}
              >
                BookClub
              </Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              <CustomButton
                startIcon={<Add />}
                onClick={() => handleClickOpen(null)}
                sx={{
                  fontFamily: "Work Sans",
                  fontWeight: 600,
                  fontSize: "px",
                  lineHeight: "24px",
                  letterSpacing: "0px",
                }}
              >
                Add
              </CustomButton>
            </Grid>
          </Grid>
          {bookClubs && bookClubs.length > 0 ? (
            <Grid container spacing={2} sx={{ overflowY: "auto", mt: "18px" }}>
              {bookClubs.map((blog, index) => (
                <Grid item lg={3} md={4} sm={12} xs={12} key={index}>
                  <StyledCard sx={{ py: "9px", boxShadow: "none", borderColor: "#EAECEE", borderRadius:"9px !importnt" }}>
                    <Box px={3}>
                      <StyledCardMedia
                        component="img"
                        image={blog?.imageUrl}
                        alt={blog.title}
                      />
                    </Box>
                    <Box mt="20px" px="11px">
                      {/* Custom description view in blogs */}
                      {/* <DescriptionParser /> */}
                      {/* <Typography variant="subtitle1">
                        {blog.title}
                      </Typography> */}
                      <CustomDescriptionParser
                        description={blog.title}
                        color="black"
                        limit={1}
                        fontWeight={500}
                      />
                      <Grid container mt="20px">
                        <Grid item xs={6}>
                          <CustomBadge
                            badgeContent={blog?.status}
                            onClick={() => handleBadgeClick(blog)}
                          />
                        </Grid>
                        <Grid item xs={6} textAlign="right">
                          <IconButton
                            aria-label="start"
                            onClick={() => handleFavoriteUpdate(blog)}
                         
                          >
                            {blog?.favourite === true ? (
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
                            onClick={() => handleClickOpen(blog?._id)}
                          >
                            <img src={`icons/edit.svg`} alt="edit" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleConfirmOpen(blog?._id)}
                          >
                            <img src={`icons/trash.svg`} alt="delete" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                Currently book clubs not exists.
              </Typography>
            </Grid>
          )}
          <Grid>
            <ConfirmDialog
              title="Delete Book Club ?"
              dialogContext="Are you sure to delete book club ?"
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
            dialogTitle={bookID ? "Edit Club" : "Add to BookClub"}
            open={openFormDialog}
            accept={{ "application/pdf": [] }}
            onClose={handleClose}
            formik={formik}
            handleFileChange={handleFileChange}
            formElements={addBookFormElements}
            id={bookID}
            loading={loading}
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

export default BookClub;
