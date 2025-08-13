import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Grid, Typography } from "@mui/material";
import { CustomButton } from "components";
import { toast } from "react-toastify";
import ErrorMsg from "components/ErrorMsg";
import QuillEditor from "components/QuillEditor/QuillEditor";
import CustomDropZone from "components/DropZone/CustomDropzone";
import AwsS3 from "utils/S3Intergration";
import PracticeApi from "services/api/practice";

const CreatePractice = ({ setOpen, practiceData = null, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  // Ensure file is always an array of objects with a url property for preview
  const initialFiles = Array.isArray(practiceData?.file)
    ? practiceData.file.map(f => ({
        url: f.url,
        type: f.type,
        extension: f.extension,
        name: f.name,
      }))
    : [];

  const initalValues = {
    description: practiceData?.description || "",
    file: initialFiles,
  };

  const validationSchema = yup.object().shape({
    description: yup.string().required("Description is required"),
    file: yup.array().min(1, "Picture is required"),
  });

  const { setFieldValue, values, handleSubmit, errors, touched } = useFormik({
    initialValues: initalValues,
    validationSchema: validationSchema,
    onSubmit: async ({ file, description }) => {
      const fileData = [];
      try {
        setLoading(true);
        for (let i = 0; i < file.length; i++) {
          const f = file[i];
          if (f.url && typeof f.url === "string" && !f.lastModified) {
            // Already uploaded, just use as-is
            fileData.push({
              url: f.url,
              type: f.type,
              extension: f.extension,
              name: f.name,
            });
          } else {
            // New file, upload it
            const { type, name } = f;
            const url = await new AwsS3(f, "images/").getS3URL();
            fileData.push({
              url,
              type,
              extension: type.split("/")[1],
              name,
            });
          }
        }
        const practiceValues = { file: fileData, description };
        let response;
        if (practiceData) {
          response = await PracticeApi.updatePractice({ ...practiceValues, id: practiceData._id });
        } else {
          response = await PracticeApi.createPractice(practiceValues);
        }
        if (response && response.message) {
          toast.success(response.message);
          setOpen(false);
          if (onSuccess) onSuccess();
        } else {
          toast.error(response?.error || "Something went wrong");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
  });
  const { description } = values;

  return (
    <form onSubmit={handleSubmit}>
      <Box display="flex" flexDirection="column" gap="12px" p="0px">
        <Box>
          <QuillEditor
            name="description"
            value={description}
            onChange={(value) => setFieldValue("description", value)}
          />
          {errors.description && <ErrorMsg error={errors.description} />}
        </Box>
        <Box sx={{ width: "100%", backgroundColor: "darkgreen" }}>
          <Grid container>
            <Grid item xs={12}>
              <CustomDropZone
                files={values.file}
                type="image"
                handleFileChange={(files) => setFieldValue("file", files)}
                disabled={loading}
              />
            </Grid>
          </Grid>
          {errors.file && touched.file && (
            <Typography color="error" fontSize={13} mt={1}>
              Picture is required
            </Typography>
          )}
        </Box>
        <Box display="flex" justifyContent="space-between">
          <CustomButton
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton disabled={loading} type="submit">
            {practiceData ? "Update" : "Add"} {loading && "..."}
          </CustomButton>
        </Box>
      </Box>
    </form>
  );
};

export default CreatePractice;
