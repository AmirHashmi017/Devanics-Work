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
  name
}) => {
  const [files, setFiles] = useState([]);
  const accept = type === 'video' ? { "video/*": [] } : type === 'image' || type === 'thumbnail' ? { "image/*": [] } : { "application/pdf": [] }
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles)
      handleFileChange(acceptedFiles);
    },
    multiple: false,
    maxFiles: 1,
    accept
  });

  const handleRemoveFile = (fileIndex) => {
    const updatedFiles = files.filter((_, i) => i !== fileIndex);
    setFiles(updatedFiles);
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
    <DragDropArea  {...getRootProps()}>
      <input name={name} {...getInputProps()} />
      <Box display='flex' justifyContent='center' gap={2}>
        {
          files.map((file, i) => (
            <Box position='relative'>
              <ImagePreviewWrapper>
                <Box position='absolute' zIndex={20} top={-12} right={-12}>
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleRemoveFile(i);
                  }} sx={{ color: "red" }}>
                    <Cancel />
                  </IconButton>
                </Box>
                {file.type.includes("pdf") ? (
                  <IconButtonWrapper>
                    <PictureAsPdf style={{ fontSize: 100 }} />
                  </IconButtonWrapper>
                ) : file.type.includes('video') ? (
                  <StyledVideo src={URL.createObjectURL(file)} controls />
                ) : (
                  <ImagePreview src={URL.createObjectURL(file)} alt="preview" />
                )}
              </ImagePreviewWrapper>
            </Box>
          ))
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
