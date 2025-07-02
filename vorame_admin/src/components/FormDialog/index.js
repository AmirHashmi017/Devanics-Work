// CustomFormDialog.js
import React from "react";
import {
  DialogContent,
  IconButton,
  Grid,
  DialogActions,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

import CustomButton from "../Button";
import CustomDropzone from "../DropZone";
import CustomQuillEditor from "../QuillEditor";
import CustomDatePicker from "../DatePicker";

import { StyledDialog, StyledDialogTitle, StyledLabel } from "./style";

const CustomFormDialog = ({
  dialogTitle,
  open,
  onClose,
  handleFileChange,
  formik,
  formElements,
  id,
  loading,
  autocompleteOptions,
  videoProgress,
  setVideoProgress,
  imageProgress,
  setImageProgress,
  videoPreview,
  setVideoPreview,
  imagePreview,
  setImagePreview,
  accept,
}) => {
  const theme = useTheme();

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle
        sx={{
          fontSize: "20px",
          fontWeight: 600,
        }}
      >
        {dialogTitle}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 6,
            top: 6,
            color: "black",
          }}
        >
          <Close />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {/* Title Text Field */}
            {formElements.map((element, index) => {
              switch (element.type) {
                case "text":
                  return (
                    <Grid item xs={12} key={index}>
                      <StyledLabel htmlFor="title">Title</StyledLabel>
                      <TextField
                        InputProps={{ sx: { borderRadius: 2.5, mt: 1 } }}
                        variant="outlined"
                        name={element.name}
                        placeholder={element.label}
                        fullWidth
                        size="small"
                        type="text"
                        value={formik.values[element.name]}
                        onChange={formik.handleChange}
                        error={
                          formik.touched[element.name] &&
                          Boolean(formik.errors[element.name])
                        }
                        helperText={
                          formik.touched[element.name] &&
                          formik.errors[element.name]
                        }
                      />
                    </Grid>
                  );
                case "quill":
                  return (
                    <Grid item xs={12} key={index}>
                      <CustomQuillEditor formik={formik} />
                    </Grid>
                  );
                case "dropzone":
                  return (
                    <Grid item xs={12} key={index}>
                      <CustomDropzone
                        handleFileChange={handleFileChange}
                        formik={formik}
                        accept={accept}
                        progress={
                          element.name === "video"
                            ? videoProgress
                            : imageProgress
                        }
                        setProgress={
                          element.name === "video"
                            ? setVideoProgress
                            : setImageProgress
                        }
                        preview={
                          element.name === "video" ? videoPreview : imagePreview
                        }
                        setPreview={
                          element.name === "video"
                            ? setVideoPreview
                            : setImagePreview
                        }
                        element={element}
                        fieldName={element.name}
                      />
                    </Grid>
                  );
                case "autocomplete":
                  return (
                    <Grid item xs={12} key={index}>
                      <Autocomplete
                        value={formik.values[element.name]}
                        onChange={(event, newValue) => {
                          formik.setFieldValue(element.name, newValue);
                        }}
                        options={autocompleteOptions || []}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={element.label}
                            error={
                              formik.touched[element.name] &&
                              Boolean(formik.errors[element.name])
                            }
                            helperText={
                              formik.touched[element.name] &&
                              formik.errors[element.name]
                            }
                          />
                        )}
                        fullWidth
                      />
                    </Grid>
                  );
                case "date":
                  return (
                    <Grid item xs={12} key={index}>
                      <CustomDatePicker
                        name={element.name}
                        label={element.label}
                        value={formik.values[element.name]}
                        onChange={formik.handleChange}
                        onBlur={() =>
                          formik.setFieldTouched(element.name, true)
                        }
                        error={
                          formik.touched[element.name] &&
                          Boolean(formik.errors[element.name])
                        }
                        helperText={
                          formik.touched[element.name] &&
                          formik.errors[element.name]
                        }
                      />
                    </Grid>
                  );
                default:
                  return null;
              }
            })}
          </Grid>
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 4,
            }}
          >
            <CustomButton disabled={loading} onClick={onClose} sx={{fontsize: "14px", fontWeight: 500}}>
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              loading={loading}
              sx={{ px: 1, py: 1, border: "5", fontsize: "14px", fontWeight: 500 }}
            >
              {id ? "Add" : "Add"}{" "}
              {/* i change >>> Update : add  to this button >>> Add : Add */}
            </CustomButton>
          </DialogActions>
        </form>
      </DialogContent>
    </StyledDialog>
  );
};

export default CustomFormDialog;
