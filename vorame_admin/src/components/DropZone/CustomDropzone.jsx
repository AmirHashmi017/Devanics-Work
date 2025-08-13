import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IconButton, Typography, Link, Box } from "@mui/material";
import { Cancel, PictureAsPdf } from "@mui/icons-material";

import {
  DragDropArea,
  ImagePreviewWrapper,
  ImagePreview,
  IconButtonWrapper,
  StyledVideo,
} from "./style";

const CustomDropZone = ({
  handleFileChange,
  type,
  name,
  files: propFiles = [],
  disabled = false,
}) => {
  const [files, setFiles] = useState(propFiles);
  const accept = type === 'video' ? { "video/*": [] } : type === 'image' || type === 'thumbnail' ? { "image/*": [] } : { "application/pdf": [] }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (!disabled) {
        setFiles(acceptedFiles)
        handleFileChange(acceptedFiles);
      }
    },
    multiple: false,
    maxFiles: 1,
    accept,
    disabled: disabled
  });

  // Sync with propFiles if they change (e.g., on dialog open)
  React.useEffect(() => {
    setFiles(propFiles);
  }, [propFiles]);

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = files.filter((_, i) => i !== fileIndex);
    setFiles(updatedFiles);
    handleFileChange(updatedFiles);
  };

  const getDropzoneText = () => {
    switch (type) {
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
    <DragDropArea  
      {...getRootProps()} 
      sx={{
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
    >
      <input name={name} {...getInputProps()} />
      <Box display='flex' justifyContent='center' gap={2}>
        {
          files.map((file, i) => {
            const isUrl = !!file.url;
            const previewUrl = isUrl ? file.url : URL.createObjectURL(file);
            return (
              <Box position='relative' key={i}>
                <ImagePreviewWrapper>
                  <Box position='absolute' zIndex={20} top={-12} right={-12}>
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveFile(i);
                      }} 
                      disabled={disabled}
                      sx={{ 
                        color: disabled ? "grey" : "red",
                        opacity: disabled ? 0.5 : 1,
                        cursor: disabled ? "not-allowed" : "pointer"
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                  {file.type && file.type.includes("pdf") ? (
                    <IconButtonWrapper>
                      <PictureAsPdf style={{ fontSize: 100 }} />
                    </IconButtonWrapper>
                  ) : file.type && file.type.includes('video') ? (
                    <StyledVideo src={previewUrl} controls />
                  ) : (
                    <ImagePreview src={previewUrl} alt="preview" />
                  )}
                </ImagePreviewWrapper>
              </Box>
            );
          })
        }
      </Box>

      {files.length < 1 && (
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
  );
};

export default CustomDropZone;
