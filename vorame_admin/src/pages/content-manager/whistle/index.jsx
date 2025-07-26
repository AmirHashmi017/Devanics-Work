// import React, {  useState } from "react";

import {
  Grid,
  Typography,
  // IconButton,
  Stack,
  // Box,
} from "@mui/material";
// import moment from "moment";
import { useFormik } from "formik";
import dayjs from "dayjs";
// import { useQuery, useMutation } from "react-query";
// import { toast } from "react-toastify";

import {
  CustomButton,
  // CustomBadge,
  // CustomStatusDialog,
  // ConfirmDialog,
  CustomLoader,
} from "../../../components";
import { useState } from "react";

import CustomQuillEditor from "../../../components/QuillEditor";
// import WhistleApi from "../../../services/api/whistle";
// import { whistleInitialValues } from "../../../constants";
// import { whistleValidationSchema } from "../../../utils/validation";
// import { StyledCard } from "./style";
// import { shadows, vorameColors } from "theme/constants";
// import DescriptionParser from "./components/DescriptionParser";

const Whistle = () => {
  // const [whistelID, setWhistleID] = useState(null);
  // const [confirmOpen, setConfirmOpen] = useState(false);
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [status, setStatus] = useState("");
  // const [deleteID, setDeleteID] = useState(null);
  // const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setisLoading] = useState("")
  const [description, setdescription] = useState("")
  // const [formData , setformData] = useState({
  //   description:'',
  // })

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data", description)
    const plainText = description.replace(/<[^>]*>?/gm, '');
    console.log(plainText); 
    setdescription(plainText);
 


  }


  // const plainText = description.replace(/<[^>]+>/g, '');
  // console.log("Plain Text:", plainText);

  // const {
  //   data: whistleList,
  //   refetch,
  //   isLoading,
  // } = useQuery(["WHISTLES_LIST"], () => WhistleApi.getWhistles({}));

  // const { data: singleWhistle } = useQuery(
  //   ["SINGLE_WHISTLE", whistelID],
  //   () => WhistleApi.getSingleWhistle({ id: whistelID }),
  //   {
  //     enabled: !!whistelID,
  //   }
  // );

  // const updateStatusMutation = useMutation(
  //   (data) => WhistleApi.updateWhistleStatus(data),
  //   {
  //     onSuccess: () => {
  //       toast.success("Status updated successfully!");
  //       refetch();
  //     },
  //     onError: () => {
  //       toast.error("Failed to update status.");
  //     },
  //   }
  // );

  // const { mutate: Whistle, isLoading: whistleMutationLoading } = useMutation(
  //   (body) => {
  //     if (whistelID) {
  //       const updatedBody = { ...body, id: whistelID };
  //       return WhistleApi.updateWhistle(updatedBody);
  //     } else {
  //       return WhistleApi.createWhistle(body);
  //     }
  //   },
  //   {
  //     onSuccess: (res) => {
  //       toast.success(res?.message);
  //       refetch();
  //     },
  //     onError: (error) => {
  //       toast.error(error.message);
  //     },
  //   }
  // );

  // const formik = useFormik({
  //   initialValues: whistleInitialValues,
  //   enableReinitialize: true,
  //   validationSchema: whistleValidationSchema,
  //   onSubmit: async (values) => {
  //     const updatedValues = {
  //       ...values,
  //       date: new Date(), // ✅ inject new updated date
  //     };

  //     try {
  //       await Whistle(updatedValues); // call API
  //       setLastUpdated(new Date());   // update display
  //     } catch (error) {
  //       console.error("Error updating whistle:", error);
  //     }
  //   },
  // });



  // useEffect(() => {
  //   if (singleWhistle && singleWhistle.findWhistle) {
  //     const { description, date } = singleWhistle.findWhistle;
  //     formik.setValues({ description });
  //     setLastUpdated(date || new Date());
  //   }
  // }, [singleWhistle]);


  // const handleBadgeClick = (blog) => {
  //   setWhistleID(blog._id);
  //   setStatus(blog.status);
  //   setDialogOpen(true);
  // };

  // const handleUpdateStatus = () => {
  //   updateStatusMutation.mutate({ id: whistelID, status });
  //   setDialogOpen(false);
  // };

  // const handleConfirmOpen = (id) => {
  //   setDeleteID(id);
  //   setConfirmOpen(true);
  // };

  // const handleDelete = async (event) => {
  //   event.preventDefault();
  //   const response = await WhistleApi.deleteWhistle(deleteID);
  //   if (response?.statusCode === 200) {
  //     toast.success(response.message);
  //     setConfirmOpen(false);
  //     setDeleteID(null);
  //     refetch();
  //   } else {
  //     toast.error("Whistle not deleted!");
  //   }
  // };

  // const handleClickOpen = (id) => {
  //   setWhistleID(id);
  // };

  // const handleExpandDescription = (id) => {
  //   if (expandedDescriptionId === id) {
  //     setExpandedDescriptionId(null);
  //   } else {
  //     setExpandedDescriptionId(id);
  //   }
  // };






  // const handlechange = (e) => {
  //   setformData(...forData , (e.target.description))
  // }
  // const handleSubmit = () => {
  //   e.preventDefault();
  //   console.log
  // };



  return (
    <>
      {
        isLoading ?
          (
            <CustomLoader />
          ) : (
            <>
              <form onSubmit={handleSubmit}>

                {/* Top bar with title + buttons */}
                <Grid
                  container
                  alignItems="center"
                  sx={{
                    px: 3,
                    py: 2,
                    // backgroundColor: "#fff",
                    // borderBottom: "1px solid #e5e7eb",
                    // boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    mb: 3,
                  }}
                >
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h5" fontWeight="bold">
                      After the Whistle
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} textAlign="right">
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <CustomButton
                        type="submit"
                        size="medium"
                      // onClick={() => {
                      //   if (!whistelID) {
                      //     toast.warning("Please select a blog to update.");
                      //     return;
                      //   }

                      //   formik.submitForm(); // ✅ call proper submit
                      // }}
                      >
                        Updated
                      </CustomButton>


                      <CustomButton
                        size="medium"
                        // onClick={() => {
                        //   if (singleWhistle) {
                        //     formik.setValues({
                        //       description:
                        //         singleWhistle?.findWhistle?.description || "",
                        //     });
                        //   } else {
                        //     formik.resetForm();
                        //   }
                        // }}
                        sx={{
                          backgroundColor: "#fff",
                          color: "#000",
                          border: "1px solid #D1D5DB",
                          "&:hover": {
                            backgroundColor: "#f3f4f6",
                          },
                        }}
                      >
                        Reset
                      </CustomButton>
                    </Stack>
                  </Grid>
                </Grid>


                {/* Whistle Editor Form */}

                <Grid>
                  <CustomQuillEditor
                    formik={{
                      values: { description },  // ✅ use your state variable
                      setFieldValue: (field, value) => {
                        if (field === 'description') {
                          setdescription(value);  // ✅ keep this
                        }
                      },
                      touched: {},
                    }}
                  />

                </Grid>
              </form>


              {/* <Typography variant="body1" sx={{ mb: 1 }}>
            Last updated: {dayjs(lastUpdated).format("DD MMMM YYYY")}
          </Typography> */}

              {/* Whistle Editor Form */}
              {/* <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomQuillEditor formik={formik} />
              </Grid>
            </Grid>
          </form> */}
              {/* <Grid container spacing={2}>
                <Grid item xs={12}>
                  <CustomQuillEditor
                    formik={{
                      values: { description: "" }, // or some static text
                      setFieldValue: () => { },     // no-op
                      touched: {},
                      errors: {},
                    }}
                  />
                </Grid>
              </Grid> */}


              {/* Whistle list below */}
              {/* {whistleList && whistleList?.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 4 }}>
              {whistleList.map((blog, index) => (
                <Grid item xs={12} key={index}>
                  <StyledCard
                    sx={{
                      boxShadow: shadows.softDepthShadow,
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  >
                    <Grid container alignItems="center">
                      <Grid item xs={4}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={500}
                          color={vorameColors.mirage}
                        >
                          {moment(blog.date).format("DD MMMM YYYY")}
                        </Typography>
                      </Grid>
                      <Grid item xs={8} textAlign="right">
                        <Stack direction="row" justifyContent="flex-end">
                          <Box sx={{ marginRight: "35px", marginTop: "4px" }}>
                            <CustomBadge
                              badgeContent={blog?.status}
                              onClick={() => handleBadgeClick(blog)}
                            />
                          </Box>
                          <IconButton
                            aria-label="edit"
                            onClick={() => handleClickOpen(blog._id)}
                          >
                            <img src="icons/edit.svg" alt="edit" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => handleConfirmOpen(blog._id)}
                          >
                            <img src="icons/trash.svg" alt="delete" />
                          </IconButton>
                          <IconButton
                            aria-label="expand"
                            onClick={() => handleExpandDescription(blog._id)}
                          >
                            {expandedDescriptionId === blog._id ? (
                              <img
                                src="icons/chevron-up.svg"
                                alt="expand-up"
                              />
                            ) : (
                              <img
                                src="icons/chevron-down.svg"
                                alt="expand"
                              />
                            )}
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
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
            <Typography variant="subtitle1" sx={{ mt: 4 }}>
              Currently no whistle exists.
            </Typography>
          )} */}

              {/* Dialogs */}
              {/* <ConfirmDialog
            title="Delete Whistle?"
            dialogContext="Are you sure you want to delete this whistle?"
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
          /> */}
            </>
          )
      }
    </>
  );
};

export default Whistle;
