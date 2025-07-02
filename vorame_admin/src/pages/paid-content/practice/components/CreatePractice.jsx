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

  const initalValues = {
    description: practiceData?.description || "",
    file: practiceData?.file?.[0] || [],
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
          const { type, name } = file[i];
          const url = await new AwsS3(file[i], "images/").getS3URL();
          fileData.push({
            url,
            type,
            extension: type.split("/")[1],
            name,
          });
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
                file={practiceData?.file}
                type="image"
                handleFileChange={(files) => setFieldValue("file", files)}
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
