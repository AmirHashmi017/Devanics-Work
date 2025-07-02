import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { ConfirmDialog } from "components";
import { useQueryClient } from "react-query";
import { TAPE } from "services/constants";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import CreateTape from "./CreateTap";
import CustomDescriptionParser from "components/DescriptionParser";
import FixedBox from "components/FixedBox";

const SingleTape = (tapeData) => {
  const { _id, title, description, status, video, thumbnail } = tapeData;
  const [showthumbnail, setShowthumbnail] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { mutate, isLoading } = useApiMutation();
  const videoRef = useRef();

  const fetchTapeList = () =>
    queryClient.invalidateQueries({ queryKey: "tapes" });
  const handleSuccess = (message) => {
    toast.success(message);
    fetchTapeList();
  };

  const handleDelete = () => {
    mutate(
      { method: "delete", url: TAPE + `delete/${_id}` },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenDeleteModal(false);
        },
      }
    );
  };

  const updateStatusHandler = (status) => {
    mutate(
      {
        method: "post",
        url: TAPE + "update-status",
        data: { id: _id, status },
      },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenStatusModal(false);
        },
      }
    );
  };

  const handleVideoPlay = () => {
    if (showthumbnail) {
      setShowthumbnail(false);
      setShowVideo(true);
      setIsPlaying(true);
    }
    if (videoRef?.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <Box width='100%'>
      <ConfirmDialog
        title="Delete Tape ?"
        dialogContext="Are you sure to delete tape ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Tape"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreateTape tapeData={tapeData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={isLoading}
        status={status}
      />
      <Box
        gap="20px"
        position="relative"
        borderRadius="10px"
        bgcolor="white"
        boxShadow="0px 0px 34px 0px #2632381F"
        height="100%"
      >
        <Box position="relative">
          {showVideo ? (
            <Box
              component="video"
              minHeight="207px"
              maxHeight="207px"
              muted
              autoPlay
              ref={videoRef}
              sx={{
                objectFit: 'cover'
              }}
              controls={isPlaying}
              onClick={handleVideoPlay}
              borderRadius="12px 12px 0px 0px"
              width={1}
              src={video[0].url}
            />
          ) : thumbnail.length > 0 ? (
            <Box
              component="img"
              bgcolor="red"
              minHeight="207px"
              maxHeight="207px"
              onClick={handleVideoPlay}
              borderRadius="12px 12px 0px 0px"
              width={1}
              src={thumbnail[0].url}
              alt="play"
            />
          ) : <Box
            component="img"
            bgcolor="red"
            minHeight="207px"
            maxHeight="207px"
            onClick={handleVideoPlay}
            borderRadius="12px 12px 0px 0px"
            width={1}
            src="/icons/play-01.svg"
            alt="play"
          />}
          {(!isPlaying && video.length > 0) && (
            <Box
              component="img"
              bgcolor="black"
              p={0.5}
              position="absolute"
              height={40}
              sx={{ cursor: "pointer" }}
              width={40}
              top="50%"
              className='cusor-pointer'
              left="50%"
              onClick={handleVideoPlay}
              src="/icons/play-01.svg"
              borderRadius="50%"
              alt="play"
            />
          )}
        </Box>
        <Box mt="12px" p="12px">
          <FixedBox height="30px">
            <Typography
              variant="h6"
              fontWeight={500}
              fontSize="13.5px"
              color="#222222"
            >
              {title}
            </Typography>
          </FixedBox>

          <Box sx={{ minHeight: '60px', display: 'flex', alignItems: 'flex-start' }}>
            <CustomDescriptionParser description={description || ""} limit={2} />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            mt={2}
            alignItems="center"
          >
            <Button
              sx={{
                textTransform: "capitalize",
                bgcolor: "#2E8852",
                borderRadius: "17px",
                color: "white",
                fontWeight: 400,
                py: "1px",
                px: "6px",
                fontSize: "12px",
              }}
              onClick={() => setOpenStatusModal(true)}
            >
              {status}
            </Button>

            <Box display="flex" gap={2}>
              <Box
                component="img"
                height="20px"
                width="20px"
                color="red"
                src="/icons/edit.svg"
                onClick={() => setOpenUpdateModal(true)}
                alt="edit"
              />
              <Box
                component="img"
                height="20px"
                width="20px"
                onClick={() => setOpenDeleteModal(true)}
                src="/icons/trash.svg"
                alt="trash"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleTape;
