// Blogs.js
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import moment from "moment";
import WhistleApi from "../../../services/api/whistle";
import {
  CustomButton,
  ConfirmDialog,
  CustomBadge,
  CustomStatusDialog,
  CustomFormDialog,
  CustomLoader,
} from "../../../components/index";
import { whistleInitialValues, addWhistleFormElements } from "../../../constants";

import { whistleValidationSchema } from "../../../utils/validation";

import { StyledCard } from "./style";
import dayjs from "dayjs";
import DescriptionParser from "./components/DescriptionParser";
import { shadows, vorameColors } from "theme/constants";

const Whistle = () => {
  const [whistelID, setWhistleID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Get whistle list
  const {
    data: whistleList,
    refetch,
    isLoading,
  } = useQuery(["WHISTLES_LIST", debouncedSearchText], () =>
    WhistleApi.getWhistles({
      searchKeyword: debouncedSearchText,
    }),
  );

  // Get single whistle
  const { data: singleWhistle } = useQuery(
    ["SINGLE_WHISTLE", whistelID],
    () => WhistleApi.getSingleWhistle({ id: whistelID }),
    {
      enabled: !!whistelID,
    },
  );

  // Update whistle status mutation
  const updateStatusMutation = useMutation(
    (data) => WhistleApi.updateWhistleStatus(data),
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

  // Create and update whistle mutation
  const { mutate: Whistle, isLoading: whistleMutationLoading } = useMutation(
    (body) => {
      if (whistelID) {
        const updatedBody = { ...body, id: whistelID };
        return WhistleApi.updateWhistle(updatedBody);
      } else {
        return WhistleApi.createWhistle(body);
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
    if (singleWhistle) {
      const { description, date } = singleWhistle?.findWhistle;

      const dateValue = date && dayjs(date);
      formik.setValues({
        description: description,
        date: dateValue,
      });
    }
  }, [singleWhistle]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete whistle api
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await WhistleApi.deleteWhistle(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Whistle not deleted!");
    }
  };

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setWhistleID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update whistle status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: whistelID, status });
    setDialogOpen(false);
  };

  // Formik
  const formik = useFormik({
    initialValues: whistleInitialValues,
    validationSchema: whistleValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle File change
  const handleFileChange = async (acceptedFiles) => { };

  // Handle whistle form submit
  const handleSubmit = async (values) => {
    Whistle(values);
  };

  // Open add whistle
  const handleClickOpen = (id) => {
    if (id) {
      setWhistleID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add whistle
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setWhistleID(null);
    setPreview(null);
    setProgress(0);
  };

  // Toggle the description on click
  const handleExpandDescription = (id) => {
    if (expandedDescriptionId === id) {
      setExpandedDescriptionId(null);
    } else {
      setExpandedDescriptionId(id);
    }
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
              <Typography variant="h4">After the Whistle</Typography>
            </Grid>
            <Grid item md={6} lg={6} sm={6} xs={12} textAlign="right">
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                alignItems='center'
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
                  size='medium'
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

          {/* Whistle list map */}
          {whistleList && whistleList?.length > 0 ? (
            <Grid container spacing='20px' sx={{ overflowY: "auto" }}>
              {whistleList?.map((blog, index) => (
                <Grid item xs={12} key={index}>
                  <StyledCard sx={{
                    boxShadow: shadows.softDepthShadow, borderRadius: '12px', padding: '12px',
                    marginBottom: 0
                  }}>
                    <Grid container alignItems='center'>
                      <Grid item xs={4}>
                        {/* Library title */}
                        <Typography variant="subtitle2" fontWeight={500} color={vorameColors.mirage}>
                          {moment(blog.date).format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                      {/* Icons and badge  */}
                      <Grid item xs={8} textAlign="right">
                        <Stack
                          direction="row"
                          justifyContent="flex-end"
                          width={1}
                        >
                          <Box sx={{
                            marginRight: "35px",
                            marginTop: "4px",
                          }}>

                            <CustomBadge
                              badgeContent={blog?.status}
                              onClick={() => handleBadgeClick(blog)}
                            />
                          </Box>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClickOpen(blog?._id)}
                          >
                            <img src='icons/edit.svg' alt="edit" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleConfirmOpen(blog?._id)}
                          >
                            <img src='icons/trash.svg' alt="delete" />
                          </IconButton>
                          <IconButton
                            aria-label="expand"
                            onClick={() => handleExpandDescription(blog._id)}
                          >
                            {expandedDescriptionId ? (
                              <img
                                src='icons/chevron-up.svg'
                                alt="expand-up"
                              />
                            ) : (
                              <img
                                src='icons/chevron-down.svg'
                                alt="expand"
                              />
                            )}
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                    {/* Custom description view in whistle */}
                    <DescriptionParser
                      description={blog?.description}
                      expandedDescriptionId={expandedDescriptionId}
                      id={blog?._id}
                    />
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                {`Currently whistle not exists.`}
              </Typography>
            </Grid>
          )}
          <Grid>
            <ConfirmDialog
              title="Delete Whistle ?"
              dialogContext="Are you sure to delete whistle ?"
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
          {/* Add whistle grid */}
          <CustomFormDialog
            dialogTitle={
              whistelID ? "Update After the Whistle" : "Add After the Whistle"
            }
            open={openFormDialog}
            onClose={handleClose}
            formik={formik}
            handleFileChange={handleFileChange}
            formElements={addWhistleFormElements}
            id={whistelID}
            loading={whistleMutationLoading}
            progress={progress}
            setProgress={setProgress}
            preview={preview}
            setPreview={setPreview}
            autocompleteOptions={null}
          />
        </>
      )}
    </>
  );
};

export default Whistle;
