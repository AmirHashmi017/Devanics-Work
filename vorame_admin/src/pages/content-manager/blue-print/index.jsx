import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Grid,
  Typography,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useTheme } from "@mui/material/styles";
import AwsS3 from "utils/S3Intergration";
import BluePrintApi from "../../../services/api/blue-print";
import {
  CustomButton,
  ConfirmDialog,
  CustomBadge,
  CustomStatusDialog,
  CustomFormDialog,
  CustomDescription,
  CustomLoader,
} from "../../../components";
import {
  bluePrintInitialValues,
  addBluePrintFormElements,
} from "../../../constants";
import { bluePrintValidationSchema } from "../../../utils/validation";

import { StyledCard } from "./style";
import { truncateFileName } from "../../../utils/truncate";
import { formatBytes } from "../../../utils/formatBytes";

const Blogs = () => {
  const [printID, setPrintID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [imageProgress, setImageProgress] = useState(0);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const theme = useTheme();

  // Get print list
  const {
    data: printList,
    refetch,
    isLoading,
  } = useQuery(["PRINT_LIST", debouncedSearchText], () =>
    BluePrintApi.getBluePrints({
      searchKeyword: debouncedSearchText,
    }),
  );

  // Get single print
  const { data: singlePrint } = useQuery(
    ["SINGLE_PRINT", printID],
    () => BluePrintApi.getSingleBluePrint({ id: printID }),
    {
      enabled: !!printID,
    },
  );

  // Update blog status mutation
  const updateStatusMutation = useMutation(
    (data) => BluePrintApi.updateStatus(data),
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

  // Create and update blog mutation
  const { mutate: Blogs, isLoading: blogMutationLoading } = useMutation(
    (body) => {
      if (printID) {
        const updatedBody = { ...body, id: printID };
        return BluePrintApi.updateBluePrint(updatedBody);
      } else {
        return BluePrintApi.createBluePrint(body);
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
    if (singlePrint) {
      formik.setFieldValue("title", singlePrint?.findPrint?.title);
      formik.setFieldValue("description", singlePrint?.findPrint?.description);
      setImagePreview(singlePrint?.findPrint?.file[0]?.url);

      // Set image
      const newFile = {
        url: singlePrint?.findPrint?.file[0]?.url,
        type: singlePrint?.findPrint?.file[0]?.type,
        extension: singlePrint?.findPrint?.file[0]?.extension,
        name: singlePrint?.findPrint?.file[0]?.name,
        size: singlePrint?.findPrint?.file[0]?.size,
      };

      formik.setFieldValue("file", [newFile]);
    }
  }, [singlePrint]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete blog api
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await BluePrintApi.deleteBluePrint(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Blue print not deleted!");
    }
  };

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setPrintID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update blog  status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: printID, status });
    setDialogOpen(false);
  };

  // Formik
  const formik = useFormik({
    initialValues: bluePrintInitialValues,
    validationSchema: bluePrintValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle File change
  const handleFileChange = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    const fileType = file.type;
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop();
    const fileUrl = URL.createObjectURL(file);
    const fileSize = formatBytes(file.size);

    // Progress;
    const url = await new AwsS3(file, "blueprint/").getS3URLWithProgress(
      (progress) => {
        // calculate progress upto 100%
        const percent = Math.round((progress.loaded / progress.total) * 100);
        setImageProgress(percent);
      },
    );

    setImagePreview(fileUrl);
    const newFile = {
      url: url,
      type: fileType,
      extension: fileExtension,
      name: fileName,
      size: fileSize,
    };

    formik.setFieldValue("file", [...formik.values.file, newFile]);
  };

  // Handle blog form submit
  const handleSubmit = async (values) => {
    Blogs(values);
  };

  // Open add blog
  const handleClickOpen = (id) => {
    if (id) {
      setPrintID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add blog
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setPrintID(null);
    setImagePreview(null);
    setImageProgress(0);
  };

  // Handle input change
  const handleInputChange = (e) => {
    e.preventDefault();
    setSearchText(e.target.value);
  };

  // Debounce searchText to avoid API calls on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  return (
    <>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <>
          <Grid container sx={{ mb: 2, mt: 2 }} alignItems="center">
            <Grid item xs={12} sm={6} lg={6} md={6} sx={{ mb: 1 }}>
              <Typography variant="h4">Blueprint</Typography>
            </Grid>
            <Grid item md={6} lg={6} sm={6} xs={12} textAlign="right">
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                width="100%"
                sx={{
                  mt: {
                    xs: 1,
                    sm: 1,
                    md: 0,
                    lg: 0,
                  },
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search"
                  value={searchText}
                  onChange={handleInputChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <img src={`/icons/search-lg.svg`} alt="Search" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", sm: "250px" },
                    "& .MuiInputBase-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <CustomButton
                  startIcon={<Add />}
                  onClick={() => handleClickOpen(null)}
                  sx={{
                    marginLeft: { xs: 0, sm: 2 },
                  }}
                >
                  Add
                </CustomButton>
              </Stack>
            </Grid>
          </Grid>
          {printList && printList.length > 0 ? (
            <Grid container spacing={2} sx={{ overflowY: "auto" }}>
              {printList.map((print, index) => (
                <Grid item lg={4} md={6} sm={12} xs={12} key={index}>
                  <StyledCard>
                    <Typography variant="subtitle1">
                      {print.title}
                    </Typography>
                    {/* Custom description view in prints */}
                    <CustomDescription
                      description={print?.description}
                      limit={6}
                    />
                    {/* Icons and badge container */}
                    <Grid spacing={1} container sx={{ mt: "auto" }}>
                      <Grid
                        item
                        xs={4}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          // justifyContent: "space-between",
                        }}
                      >
                        <img src={`images/Filetype-Icon.jpg`} alt="PDF" />
                        <Stack
                          spacing={2}
                          direction="row"
                          sx={{ mt: 1, ml: 1 }}
                        >
                          <Typography variant="body5" color="textPrimary">
                            {truncateFileName(print?.file[0]?.name, 5)}
                          </Typography>
                          <Typography
                            component="span"
                            style={{ whiteSpace: "nowrap" }}
                            variant="subtitle1"
                            color={theme.palette.info.green}
                          >
                            {print?.file[0]?.size}
                          </Typography>
                        </Stack>
                      </Grid>

                      <Grid item xs={8} textAlign="right">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="flex-end"
                        >
                          <div
                            style={{ marginRight: "35px", marginTop: "5px" }}
                          >
                            <CustomBadge
                              badgeContent={print?.status}
                              onClick={() => handleBadgeClick(print)}
                            />
                          </div>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClickOpen(print?._id)}
                          >
                            <img src={`icons/edit.svg`} alt="edit" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleConfirmOpen(print?._id)}
                          >
                            <img src={`icons/trash.svg`} alt="delete" />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                Currently prints not exists.
              </Typography>
            </Grid>
          )}
          <Grid>
            <ConfirmDialog
              title="Delete Print ?"
              dialogContext="Are you sure to delete print ?"
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
            dialogTitle={printID ? "Update Blueprint" : "Add Blueprint"}
            open={openFormDialog}
            onClose={handleClose}
            formik={formik}
            handleFileChange={handleFileChange}
            formElements={addBluePrintFormElements}
            id={printID}
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
        </>
      )}
    </>
  );
};

export default Blogs;
