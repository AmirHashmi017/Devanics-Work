import React, { useState, useEffect } from "react";
import CustomDialog from "components/Modal";
import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { useMutation, useQuery } from "react-query";

import { CustomButton, CustomTextField } from "components";
import CustomDropZone from "components/DropZone";
import AwsS3 from "utils/S3Intergration";
import LoungeApi from "services/api/lounge";
import { loungeValidationSchema } from "../../../../../utils/validation";
import { loungeInitialValues, loungeFileElement } from "../../../../../constants";

import { StyledLabel } from "./style";
import { SketchPicker } from "react-color";
import useToggleVisibility from "hooks/useToggleVisibilty";

const CreateLounge = ({ open, setOpen, id, setID, refetch }) => {
  const [imageProgress, setImageProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [color, setColor] = useState("#fa8072");
  const {
    containerRef: colorRef,
    isVisible: isColorVisible,
    toggleVisibility,
  } = useToggleVisibility();

  // Get single lounge
  const { data: singleLounge } = useQuery(
    ["SINGLE_LOUNGE", id],
    () => LoungeApi.getSingleLounge({ id: id }),
    {
      enabled: !!id,
    }
  );

  // Create and update lounge mutation
  const { mutate: Lounge, isLoading: loungeLoading } = useMutation(
    (body) => {
      if (id) {
        const updatedBody = { ...body, id: id };
        return LoungeApi.updateLounge(updatedBody);
      } else {
        return LoungeApi.createLounge(body);
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
        console.log("Lounge api response error ====>", error);
        toast.error(error.message);
      },
    }
  );

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
        url = await new AwsS3(file, "lounge/").getS3URLWithProgress(
          (progress) => {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
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
      } catch (error) {
        console.log("Error in image upload in s3 ===>", error);
      }
    }
  };

  // Handle lounge form submit
  const handleSubmit = async (values) => {
    Lounge(values);
  };

  // Set form values on update
  useEffect(() => {
    if (singleLounge) {
      formik.setFieldValue("category", singleLounge?.findLounge?.category);
      formik.setFieldValue("color", singleLounge?.findLounge?.color);
      formik.setFieldValue("status", singleLounge?.findLounge?.status);
      setImagePreview(singleLounge?.findLounge?.file[0]?.url);

      // Set image
      const newFile = {
        url: singleLounge?.findLounge?.file[0]?.url,
        type: singleLounge?.findLounge?.file[0]?.type,
        extension: singleLounge?.findLounge?.file[0]?.extension,
        name: singleLounge?.findLounge?.file[0]?.name,
      };

      formik.setFieldValue("file", [newFile]);
    }
  }, [singleLounge]);

  // Formik
  const formik = useFormik({
    initialValues: loungeInitialValues,
    validationSchema: loungeValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  // Handle close
  const handleClose = () => {
    setOpen(false);
    setImagePreview(null);
    formik.resetForm();
    if (id) {
      setID(null);
    }
  };

  return (
    <CustomDialog
    
      title={id ? "Update Category" : "Add Category"}
      open={open}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2} sx={{}}>
          {/* Category input */}
          <Grid item xs={12}>
            <StyledLabel htmlFor="title" sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#344054",
            }}> Category Name</StyledLabel>
            <CustomTextField
              fullWidth
              name="category"
              placeholder="Enter Category"
              type="text"
              value={formik.values.category}
              onChange={formik.handleChange}
              variant="outlined"
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            />
          </Grid>
          {/* Color input */}
          <Grid item xs={8} md={5} lg={5}>
            <StyledLabel htmlFor="title" sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#344054",
            }}>Assign color</StyledLabel>

            <CustomTextField
              fullWidth
              name="color"
              placeholder="Enter Code"
              type="text"
              value={formik.values.color}
              onChange={formik.handleChange}
              variant="outlined"
              error={formik.touched.color && Boolean(formik.errors.color)}
              helperText={formik.touched.color && formik.errors.color}
            />
          </Grid>
          {/* Color image */}
          <Grid item xs={4} md={4} lg={4} sx={{ mt: 2.5 }}>
            <Box position="relative">
              <Box className="cursor-pointer" onClick={toggleVisibility}>
                <Avatar alt="Color" src={`images/color.png`} />
              </Box>
              {isColorVisible && (
                <Box ref={colorRef} position="absolute" right={0} top={40}>
                  <SketchPicker
                    onChange={(color) => {
                      setColor(color);
                      formik.setFieldValue("color", color.hex);
                    }}
                    color={color}
                  />
                </Box>
              )}
            </Box>
          </Grid>
          {/* Status Radios  */}
          <Grid item md={6} lg={6} xs={12} sm={12}>
            <StyledLabel htmlFor="title" sx={{
              fontWeight: 500,
              fontSize: 14,
              color: "#344054",
            }}>Change Status</StyledLabel>
            <FormControl
              component="fieldset"
              error={formik.touched.status && Boolean(formik.errors.status)}
            >
              <RadioGroup
                row
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="Inactive"
                  control={<Radio />}
                  label="Inactive"
                />
              </RadioGroup>
              {formik.touched.status && formik.errors.status && (
                <FormHelperText>{formik.errors.status}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          {/* File input  */}
          <Grid
            container
            display="flex"
            justifyContent="flex-start"
            sx={{ mx: 2, mt: 4 }}
          >
            <Grid item md={6} lg={6} xs={12} sm={12}>
              <CustomDropZone
                handleFileChange={handleFileChange}
                formik={formik}
                progress={imageProgress}
                setProgress={setImageProgress}
                preview={imagePreview}
                setPreview={setImagePreview}
                element={loungeFileElement}
                fieldName={loungeFileElement.fieldName}
              />
            </Grid>
          </Grid>
          {/* Buttons container */}
          <Grid container justifyContent="space-between" sx={{ mt: 5 }}>
            <CustomButton onClick={handleClose} sx={{ mx: 2, fontSize:"14px", fontWeight: 500, color:"#344054",}}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" loading={loungeLoading} sx={{ mx: 2, fontSize:"14px", fontWeight: 500, }}>
              {id ? "Update" : "Upload"}
            </CustomButton>
          </Grid>
        </Grid>
      </form>
    </CustomDialog>
  );
};

export default CreateLounge;
