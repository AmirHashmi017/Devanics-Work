import { useFormik } from "formik";
import { toast } from "react-toastify";
import AwsS3 from "utils/S3Intergration";
import { Add } from "@mui/icons-material";
import BlogApi from "../../../services/api/blog";
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Grid, Typography, IconButton, Box } from "@mui/material";
import {
  CustomButton,
  ConfirmDialog,
  CustomBadge,
  CustomStatusDialog,
  CustomFormDialog,
  CustomDescription,
  CustomLoader,
} from "../../../components";
import { blogInitialValues, addBlogFormElements } from "../../../constants";
import { blogValidationSchema } from "../../../utils/validation";

import { StyledCardMedia, StyledCard } from "./style";
import { shadows, vorameColors } from "theme/constants";
import { grey, red, yellow } from "@mui/material/colors";

const Blogs = () => {
  const [blogID, setBlogID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Get blogs list
  const {
    data: blogList,
    refetch,
    isLoading,
  } = useQuery("BLOG_LIST", () => BlogApi.getBlogs());

  // Get single blot
  const { data: singleBlog } = useQuery(
    ["SINGLE_BLOG", blogID],
    () => BlogApi.getSingleBlog({ id: blogID }),
    {
      enabled: !!blogID,
    },
  );

  // Update blog status mutation
  const updateStatusMutation = useMutation(
    (data) => BlogApi.updateBlogStatus(data),
    {
      onSuccess: () => {
        toast.success("Status updated successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update status.");
      },
    },
  );

  // Update blog favourite mutation
  const updateFavoriteMutation = useMutation(
    (data) => BlogApi.updateBlogFavourite(data),
    {
      onSuccess: () => {
        toast.success("Favorite status updated successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update favorite status.");
      },
    },
  );

  // Create and update blog mutation
  const { mutate: Blogs, isLoading: blogMutationLoading } = useMutation(
    (body) => {
      if (blogID) {
        const updatedBody = { ...body, id: blogID };
        return BlogApi.updateBlog(updatedBody);
      } else {
        return BlogApi.createBlog(body);
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
    },
  );

  // Set form values on update

  useEffect(() => {
    if (singleBlog) {
      formik.setFieldValue("title", singleBlog?.findBlog?.title);
      formik.setFieldValue("description", singleBlog?.findBlog?.description);
      setImagePreview(singleBlog?.findBlog?.file[0]?.url);

      // Set image
      const newFile = {
        url: singleBlog?.findBlog?.file[0]?.url,
        type: singleBlog?.findBlog?.file[0]?.type,
        extension: singleBlog?.findBlog?.file[0]?.extension,
        name: singleBlog?.findBlog?.file[0]?.name,
      };

      formik.setFieldValue("file", [newFile]);
    }
  }, [singleBlog]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete blog api
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await BlogApi.deleteBlog(deleteID);
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
    setBlogID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update blog  status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: blogID, status });
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
    initialValues: blogInitialValues,
    validationSchema: blogValidationSchema,
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
              (progress.loaded / progress.total) * 100,
            );
            setImageProgress(percent);
          },
        );
        setImagePreview(fileUrl);
        setVideoPreview(null);
        setVideoProgress(0);
        const newFile = {
          url: url,
          type: fileType,
          extension: fileExtension,
          name: fileName,
        };

        formik.setFieldValue("file", [...formik.values.file, newFile]);
      } catch (error) {
      }
    }
  };

  // Handle blog form submit
  const handleSubmit = async (values) => {
    Blogs(values);
  };

  // Open add blog
  const handleClickOpen = (id) => {
    if (id) {
      setBlogID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add blog
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setBlogID(null);
    setImagePreview(null);
    setImageProgress(0);
  };

  return (
    <>
<Box  sx={{  overflowX: "hidden", overflowY: "auto" }} p={2}>
  <Box display="flex" justifyContent="space-between" mb={2} mt={2}>
    <Typography sx={{fontSize: "24px", fontWeight: 600,  }}>Blogs</Typography>
    <CustomButton startIcon={<Add />} onClick={() => handleClickOpen(null)}>
      Add
    </CustomButton>
  </Box>

  {blogList && blogList.length > 0 ? (
    <Box display="flex" flexWrap="wrap" gap={2}>
      {blogList.map((blog, index) => (
        <Box
        
          key={index}
          flexBasis={{ xs: "100%", sm: "48%", md: "24%" }}
          borderRadius="12px"
          py="12px"
          px={2}
          border={1}
          borderColor={grey[200]}
          bgcolor="white" 
          maxWidth="320px"
          // boxShadow={shadows.softDepthShadow}
          // bgcolor="white"
        >
          <Box display="flex" justifyContent="center" >
            <StyledCardMedia
              component="img"
              image={blog.file[0]?.url}
              alt={blog.title}
            />
            {/* <StyledCardMedia
            component="img"
              image={blog.file[1]?.url}
              alt={blog.title}
            /> */}
            
          </Box>
              
          <Box className="blog-details" mt={3}>
            <Typography
              variant="subtitle1"
              color={vorameColors.mirage}
              fontWeight={500}
            >
              {blog.title}
            </Typography>

            <CustomDescription description={blog?.description} limit={1} />

            <Box display="flex" justifyContent="space-between" mt={2}>
              <CustomBadge
                badgeContent={blog?.status}
                onClick={() => handleBadgeClick(blog)}
              />
              <Box>
                <IconButton
                  aria-label="start"
                  onClick={() => handleFavoriteUpdate(blog)}
                >
                  <img
                    src={
                      blog?.favourite
                        ? `icons/star-active.svg`    
                        : `icons/star.svg`
                    }
                    alt="star"
                  />
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
              </Box>  
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  ) : (
    <Typography variant="subtitle1">Currently blogs not exists.</Typography>
  )}

  {/* Dialogs and Forms */}
  <ConfirmDialog
    title="Delete blog post"
    dialogContext="Are you sure you want to delete this blog? This action cannot be undone."
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

  <CustomFormDialog
    dialogTitle={blogID ? "Edit Blog" : "Add to Blog"}
    open={openFormDialog} 
    onClose={handleClose}
    formik={formik}
    handleFileChange={handleFileChange}
    formElements={addBlogFormElements}
    id={blogID}
    loading={blogMutationLoading}
    videoProgress={videoProgress}
    setVideoProgress={setVideoProgress}
    imageProgress={imageProgress}
    setImageProgress={setImageProgress}
    videoPreview={videoPreview}
    setVideoPreview={setVideoPreview}
    imagePreview={imagePreview}
    setImagePreview={setImagePreview}
  />
 </Box> 
</>

  
  );
};

export default Blogs;
