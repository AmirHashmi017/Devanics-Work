import React from "react";
import { useDropzone } from "react-dropzone";
import { IconButton, Typography, Link } from "@mui/material";
import { Cancel, PictureAsPdf } from "@mui/icons-material";

import { UploadProgressBar } from "components";

import {
  DragDropArea,
  ImageError,
  ImagePreviewWrapper,
  ImagePreview,
  CancelButtonWrapper,
  IconButtonWrapper,
  StyledVideo,
  CancelVideoWrapper,
  SmallCancelButton,
} from "./style";

const CustomDropZone = ({
  handleFileChange,
  formik,
  progress,
  setProgress,
  preview,
  setPreview,
  element,
  fieldName,
  disabled = false,
  accept = {
    "image/*": [],
    "video/*": [],
    "application/pdf": [],
  }
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!disabled) {
        handleFileChange(acceptedFiles);
      }
    },
    accept,
    disabled: disabled
  });

  const handleCancelClick = (e) => {
    if (disabled) return;
    e.stopPropagation();
    formik.setFieldValue(fieldName, []);
    setPreview(null);
    setProgress(0);
  };

  const getDropzoneText = () => {
    switch (element?.inputType) {
      case "thumbnail":
        return "Select a thumbnail or";
      case "video":
        return "Select a video or";
      case "image":
        return "Select a Picture or";
      case "pdf":
        return "Select a PDF, or";
      case "smallFile":
        return "Select a Picture or";
      default:
        return;
    }
  };

  return (
    <>
      <DragDropArea 
        {...getRootProps()} 
        sx={{
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? 'none' : 'auto'
        }}
      >
        <input {...getInputProps()} accept={accept} />
        {/* Show preview image */}

        {/* Showing upload progress */}
        {progress > 0 && progress < 100 && (
          <UploadProgressBar value={progress} />
        )}

        {preview && (
          <ImagePreviewWrapper>
            {element.inputType === "video" ? (
              <>
                <CancelVideoWrapper>
                  <IconButton 
                    onClick={handleCancelClick} 
                    disabled={disabled}
                    sx={{ 
                      color: disabled ? "grey" : "red",
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "pointer"
                    }}
                  >
                    <Cancel />
                  </IconButton>
                </CancelVideoWrapper>
              </>
            ) : element.inputType === "smallFile" ? (
              <>
                <SmallCancelButton>
                  <IconButton 
                    onClick={handleCancelClick} 
                    disabled={disabled}
                    sx={{ 
                      color: disabled ? "grey" : "red",
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "pointer"
                    }}
                  >
                    <Cancel />
                  </IconButton>
                </SmallCancelButton>
              </>
            ) : (
              <>
                <CancelButtonWrapper>
                  <IconButton 
                    onClick={handleCancelClick} 
                    disabled={disabled}
                    sx={{ 
                      color: disabled ? "grey" : "red",
                      opacity: disabled ? 0.5 : 1,
                      cursor: disabled ? "not-allowed" : "pointer"
                    }}
                  >
                    <Cancel />
                  </IconButton>
                </CancelButtonWrapper>
              </>
            )}

            {element?.inputType === "pdf" ? (
              <IconButtonWrapper>
                <PictureAsPdf style={{ fontSize: 100 }} />
              </IconButtonWrapper>
            ) : element?.inputType === "video" ? (
              <StyledVideo controls>
                <source src={preview} type="video/mp4" />
              </StyledVideo>
            ) : (
              <ImagePreview src={preview} alt="preview" />
            )}
          </ImagePreviewWrapper>
        )}

        {progress <= 0 && formik?.values?.[fieldName]?.length <= 0 && (
          <>
            <IconButton>
              <img src={`/icons/upload.svg`} alt="upload" />
            </IconButton>
            <Typography>
              <Typography>
                {getDropzoneText()} <br /> drag and drop here
              </Typography>
            </Typography>
            <Typography sx={{ mt: 1 }}>
              <Link sx={{ textDecoration: 'none' }}>Browse</Link>
            </Typography>
          </>
        )}
      </DragDropArea>
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <ImageError>{formik.errors[fieldName]}</ImageError>
      )}
    </>
  );
};

export default CustomDropZone;
