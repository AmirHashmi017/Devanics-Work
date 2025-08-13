import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Stack,
  Box,
} from "@mui/material";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { useQuery, useMutation } from "react-query";
import { toast } from "react-toastify";

import {
  CustomButton,
  CustomLoader,
} from "../../../components";
import CustomQuillEditor from "../../../components/QuillEditor";
import WhistleApi from "../../../services/api/whistle";
import { whistleInitialValues } from "../../../constants";
import { whistleValidationSchema } from "../../../utils/validation";
import ConfirmationModal from "../../../components/Modal/ConfirmationModal";

const Whistle = () => {
  const [whistleID, setWhistleID] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewWhistle, setIsNewWhistle] = useState(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] = useState(false);

  // Get whistles list
  const {
    data: whistleList,
    refetch,
    isLoading: isLoadingWhistles,
  } = useQuery("WHISTLES_LIST", () => WhistleApi.getWhistles({}));

  // Get single whistle (latest one)
  const { data: singleWhistle } = useQuery(
    ["SINGLE_WHISTLE", whistleID],
    () => WhistleApi.getSingleWhistle({ id: whistleID }),
    {
      enabled: !!whistleID,
    },
  );

  // Create and update whistle mutation
  const { mutate: Whistle, isLoading: whistleMutationLoading } = useMutation(
    (body) => {
      if (whistleID && !isNewWhistle) {
        const updatedBody = { ...body, id: whistleID };
        return WhistleApi.updateWhistle(updatedBody);
      } else {
        return WhistleApi.createWhistle(body);
      }
    },
    {
      onSuccess: (res) => {
        if (res?.statusCode === 201 || res?.statusCode === 200) {
          toast.success(res?.message || "Whistle saved successfully!");
          refetch();
          setHasChanges(false);
          setOriginalData(formik.values);
          setIsNewWhistle(false);
        }
      },
      onError: (error) => {
        toast.error(error?.message || "Failed to save whistle");
      },
    },
  );

  // Formik setup
  const formik = useFormik({
    initialValues: whistleInitialValues,
    enableReinitialize: true,
    validationSchema: whistleValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const updatedValues = {
        ...values,
        date: new Date(),
      };

      try {
        await Whistle(updatedValues);
        setLastUpdated(new Date());
      } catch (error) {
        console.error("Error updating whistle:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Load latest whistle data
  useEffect(() => {
    if (whistleList && whistleList.length > 0) {
      // Get the latest whistle
      const latestWhistle = whistleList[0];
      setWhistleID(latestWhistle._id);
      setLastUpdated(latestWhistle.date);
      setIsNewWhistle(false);
    } else {
      // No whistles exist, this will be a new whistle
      setIsNewWhistle(true);
      setWhistleID(null);
      setLastUpdated(null);
    }
  }, [whistleList]);

  // Set form values when single whistle data is loaded
  useEffect(() => {
    if (singleWhistle && singleWhistle.findWhistle) {
      const { description, date } = singleWhistle.findWhistle;
      formik.setValues({ description: description || "" });
      setOriginalData({ description: description || "" });
      setLastUpdated(date || new Date());
    } else if (isNewWhistle) {
      // For new whistle, set empty values
      formik.setValues({ description: "" });
      setOriginalData({ description: "" });
    }
  }, [singleWhistle, isNewWhistle]);

  // Check for changes
  useEffect(() => {
    if (originalData) {
      const currentData = formik.values;
      const currentDescription = currentData.description || "";
      const originalDescription = originalData.description || "";
      
      // Strip HTML tags for comparison
      const stripHtml = (html) => {
        if (!html) return "";
        return html.replace(/<[^>]*>/g, '').trim();
      };
      
      const currentPlainText = stripHtml(currentDescription);
      const originalPlainText = stripHtml(originalDescription);
      
      const hasDataChanged = currentPlainText !== originalPlainText;
      const hasContent = currentPlainText !== "";
      
      console.log('Change detection:', {
        currentPlainText,
        originalPlainText,
        hasDataChanged,
        hasContent,
        isNewWhistle
      });
      
      // For existing whistle: enable only if there are actual changes
      // For new whistle: enable if there's content
      if (isNewWhistle) {
        setHasChanges(hasContent);
      } else {
        setHasChanges(hasDataChanged);
      }
    }
  }, [formik.values, originalData, isNewWhistle]);

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    formik.setFieldValue(field, value);
  };

  // Handle revert
  const handleRevert = () => {
    if (originalData) {
      formik.setValues(originalData);
      setHasChanges(false);
    }
  };

  // Handle update
  const handleUpdate = () => {
    if (isNewWhistle) {
    formik.submitForm();
    } else {
      setOpenUpdateConfirm(true);
    }
  };

  return (
    <>
      {isLoadingWhistles ? (
        <CustomLoader />
      ) : (
        <>
          <form onSubmit={formik.handleSubmit}>
            {/* Top bar with title + buttons */}
            <Grid
              container
              alignItems="flex-start"
              sx={{
                px: 3,
                py: 2,
                position: "sticky",
                top: 0,
                zIndex: 10,
                mb: 0, // No gap between header and content
                mt: 2, // 32px gap from top
              }}
            >
              <Grid item xs={12} sm={6}>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontFamily: "Work Sans",
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "32px",
                    fontStyle: "normal",
                    color: "#222222"
                  }}
                >
                  After the Whistle
                </Typography>
                {lastUpdated && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}> {/* Reduced gap */}
                    Last updated: {dayjs(lastUpdated).format("DD MMMM YYYY, h:mm A")}
                  </Typography>
                )}
                {isNewWhistle && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0 }}> {/* Reduced gap */}
                    No whistle exists. Create a new one.
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} textAlign="right" sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <CustomButton
                    type="button"
                    size="medium"
                    onClick={handleRevert}
                    disabled={!hasChanges || isNewWhistle}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#344054",
                      border: "1px solid #D1D5DB",
                      opacity: hasChanges && !isNewWhistle ? 1 : 0.6,
                      "&:hover": {
                        backgroundColor: "#f3f4f6",
                      },
                      "& .MuiButton-label": {
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "16px",
                      },
                    }}
                  >
                    Reset
                  </CustomButton>
                  <CustomButton
                    type="button"
                    size="medium"
                    onClick={handleUpdate}
                    disabled={!hasChanges || whistleMutationLoading}
                    sx={{
                      opacity: hasChanges ? 1 : 0.6,
                      "& .MuiButton-label": {
                        fontFamily: "Inter",
                        fontWeight: 600,
                        fontSize: "16px",
                      },
                    }}
                  >
                    {whistleMutationLoading ? "Saving..." : (isNewWhistle ? "Create" : "Update")}
                  </CustomButton>
                </Stack>
              </Grid>
            </Grid>

            {/* Whistle Editor Form */}
            <Box sx={{ px: 3, mt: 0 }}> {/* No gap */}
              <CustomQuillEditor
                formik={{
                  values: formik.values,
                  setFieldValue: handleFieldChange,
                  touched: formik.touched,
                  errors: formik.errors,
                }}
              />
            </Box>
          </form>
          <ConfirmationModal
            open={openUpdateConfirm}
            onClose={() => setOpenUpdateConfirm(false)}
            onConfirm={async () => {
              await formik.submitForm();
              setOpenUpdateConfirm(false);
            }}
            heading="Update After the Whistle?"
            text="Are you sure you want to update the After the Whistle content? This will overwrite the current content."
            imgSrc="/icons/Featured-icon.png"
            cancelBtnText="Cancel"
            confirmBtnText={whistleMutationLoading ? "Updating..." : "Update"}
          />
        </>
      )}
    </>
  );
};

export default Whistle;
