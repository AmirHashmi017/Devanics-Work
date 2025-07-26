import React, { useRef, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ConfirmDialog } from "components";
import { useQueryClient } from "react-query";
import TranquilityApi from "services/api/tranquility";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import CreateTranquility from "./CreateTap";
import CustomDescriptionParser from "components/DescriptionParser";
import FixedBox from "components/FixedBox";
import { StyledCard } from "theme/styles";
import { StyledCardMedia, StyledVideo, StyledMediaIcon } from "../../../content-manager/clips/style";

const CARD_HEIGHT = 442;
const CARD_WIDTH = 300;

const SingleTranquility = (tranquilityData) => {
  const { _id, title, description, video, thumbnail } = tranquilityData;
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();

  const fetchTranquilityList = () =>
    queryClient.invalidateQueries({ queryKey: ["tranquilities"] });
  const handleSuccess = (message) => {
    toast.success(message);
    fetchTranquilityList();
  };

  const handleDelete = () => {
    TranquilityApi.deleteTranquility(_id).then((res) => {
      if (res && res.message) {
        handleSuccess(res.message);
        setOpenDeleteModal(false);
      }
    });
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
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
    <StyledCard sx={{ height: `${CARD_HEIGHT}px`, width: `${CARD_WIDTH}px`, margin: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <ConfirmDialog
        title="Delete Tranquility?"
        dialogContext="Are you sure to delete this tranquility?"
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomDialog
        title="Update Tranquility"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreateTranquility tranquilityData={tranquilityData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <Box sx={{ flexGrow: 1 }}>
        <StyledCardMedia>
          <StyledVideo
            ref={videoRef}
            onClick={handleVideoClick}
            controls
            poster={thumbnail && thumbnail.length > 0 ? (thumbnail[0].url || (thumbnail[0] instanceof File ? URL.createObjectURL(thumbnail[0]) : undefined)) : undefined}
          >
            <source src={video && video.length > 0 ? (video[0].url || (video[0] instanceof File ? URL.createObjectURL(video[0]) : undefined)) : undefined} type="video/mp4" />
          </StyledVideo>
          <StyledMediaIcon onClick={handleVideoClick}>
            {isPlaying ? (
              <img src={`/icons/pause.svg`} alt="Pause" />
            ) : (
              <img src={`/icons/play.svg`} alt="Play" />
            )}
          </StyledMediaIcon>
        </StyledCardMedia>
        <Box p={0.5} pl={1.5}>
          <Box sx={{ maxWidth: 220, textAlign: 'left' }}>
            <Typography
              overflow="hidden"
              sx={{ fontSize: "13px", fontWeight: 500, mb: 0, mt: 0 }}
            >
              {title}
            </Typography>
            <CustomDescriptionParser description={description} limit={2} />
          </Box>
          <Box display="flex" gap={2} alignItems="center" justifyContent="flex-end" mt={0.5}>
            <IconButton aria-label="edit" onClick={() => setOpenUpdateModal(true)}>
              <img src={`/icons/edit.svg`} alt="edit" />
            </IconButton>
            <IconButton aria-label="delete" onClick={() => setOpenDeleteModal(true)}>
              <img src={`/icons/trash.svg`} alt="trash" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </StyledCard>
  );
};

export default SingleTranquility;
