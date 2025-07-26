// Blogs.js
import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "react-query";
import {
  Grid,
  Typography,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import LibraryApi from "../../../services/api/library";
import {
  CustomButton,
  ConfirmDialog,
  CustomStatusDialog,
  CustomFormDialog,
  CustomLoader,
  CustomTab,
} from "../../../components";
import {
  libraryInitialValues,
  addLibraryFormElements,
  typeOptions,
} from "../../../constants";

import { libraryValidationSchema } from "../../../utils/validation";
import SingeLibraryComponent from "./components/SingeLibrary";
import LibraryFooter from "./components/libraryfooter";

const Library = () => {
  const [libraryID, setLibraryID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);
  const [openFormDialog, setOpenFormDialog] = React.useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [tabValue, setTabValue] = useState("A");
  const [expandedDescriptionId, setExpandedDescriptionId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Get library list
  const {
    data: libraryList,
    refetch,
    isLoading,
  } = useQuery(["LIBRARIES_LIST", tabValue, debouncedSearchText], () =>
    LibraryApi.getLibraries({
      type: tabValue,
      searchKeyword: debouncedSearchText,
    }),
  );

  // Get single library
  const { data: singleLibrary } = useQuery(
    ["SINGLE_LIBRARY", libraryID],
    () => LibraryApi.getSingleLibrary({ id: libraryID }),
    {
      enabled: !!libraryID,
    },
  );

  // Update library status mutation
  const updateStatusMutation = useMutation(
    (data) => LibraryApi.updateLibraryStatus(data),
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

  // Create and update library mutation
  const { mutate: Library, isLoading: libraryMutationLoading } = useMutation(
    (body) => {
      if (libraryID) {
        const updatedBody = { ...body, id: libraryID };
        return LibraryApi.updateLibrary(updatedBody);
      } else {
        return LibraryApi.createLibrary(body);
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
    if (singleLibrary) {
      formik.setFieldValue("title", singleLibrary?.findLibrary?.title);
      formik.setFieldValue(
        "description",
        singleLibrary?.findLibrary?.description,
      );
      formik.setFieldValue("type", singleLibrary?.findLibrary?.type);
    }
  }, [singleLibrary]);

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete library api
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await LibraryApi.deleteLibrary(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Library not deleted!");
    }
  };

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setLibraryID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Handle update library  status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: libraryID, status });
    setDialogOpen(false);
  };

  // Formik
  const formik = useFormik({
    initialValues: libraryInitialValues,
    validationSchema: libraryValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle File change
  const handleFileChange = async (acceptedFiles) => { };

  // Handle library form submit
  const handleSubmit = async (values) => {
    Library(values);
  };

  // Open add library
  const handleClickOpen = (id) => {
    if (id) {
      setLibraryID(id);
    }
    setOpenFormDialog(true);
  };

  // Close add library
  const handleClose = () => {
    setOpenFormDialog(false);
    formik.resetForm();
    setLibraryID(null);
    setPreview(null);
    setProgress(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
              <Typography sx={{fontSize:"24px", fontWeight:600}}>Library A-Z</Typography>
            </Grid>
            <Grid item md={6} sm={6} xs={12} textAlign="right">
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
                    backgroundColor:"#F4F7FA",
                    width: { xs: "100%", sm: "350px" },
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

          {/* Tabs */}
          <CustomTab
            tabOptions={typeOptions}
            tabValue={tabValue}
            handleChange={handleTabChange}
          />
          {/* Library list map */}
          {libraryList && libraryList?.length > 0 ? (
            <Grid container spacing={2} sx={{ overflowY: "auto" }}>
              {libraryList?.map((blog, index) => (
                <Grid item lg={6} md={6} sm={12} xs={12} key={index}>
                  <SingeLibraryComponent id={blog._id} {...blog} setStatus={setStatus} setLibraryID={setLibraryID} setDialogOpen={setDialogOpen} setOpenFormDialog={setOpenFormDialog} setDeleteID={setDeleteID} setConfirmOpen={setConfirmOpen} blog={blog} expandedDescriptionId={expandedDescriptionId} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid>
              <Typography variant="subtitle1">
                {`Currently libraries not exists for given type: ${tabValue}.`}
              </Typography>
            </Grid>
          )}
          <Grid>
            <ConfirmDialog
              title="Delete Library ?"
              dialogContext="Are you sure to delete library ?"
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
            dialogTitle={libraryID ? "Update Library" : "Add Library"}
            open={openFormDialog}
            onClose={handleClose}
            formik={formik}
            handleFileChange={handleFileChange}
            formElements={addLibraryFormElements}
            id={libraryID}
            loading={libraryMutationLoading}
            progress={progress}
            setProgress={setProgress}
            preview={preview}
            setPreview={setPreview}
            autocompleteOptions={typeOptions}
          />
          <div>
                {/* <LibraryFooter /> */}

          </div>
        </>
        
      )}
     
    </>
  );
};

export default Library;
