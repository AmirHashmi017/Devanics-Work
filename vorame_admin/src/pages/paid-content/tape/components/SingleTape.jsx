import React, { useRef, useState,useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { grey } from "@mui/material/colors";
import { ConfirmDialog, CustomBadge, CustomStatusDialog } from "components";
import { useQueryClient, useMutation } from "react-query";
import TranquilityApi from "services/api/tranquility";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import CreateTranquility from "./CreateTap";
import CustomDescriptionParser from "components/DescriptionParser";
import FixedBox from "components/FixedBox";
import { StyledCardMedia, StyledVideo, StyledMediaIcon, StyledCard } from "../../../content-manager/clips/style";

const CARD_HEIGHT = 442;


const SingleTranquility = (tranquilityData) => {
  const { _id, title, description, video, thumbnail, status } = tranquilityData;
  const queryClient = useQueryClient();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status || "Active");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef();

  const fetchTranquilityList = () =>
    queryClient.invalidateQueries({ queryKey: ["tranquilities"] });
  const handleSuccess = (message) => {
    toast.success(message);
    fetchTranquilityList();
  };

  // Update tranquility status mutation
  const updateStatusMutation = useMutation(
    (data) => TranquilityApi.updateTranquilityStatus(data),
    {
      onSuccess: () => {
        toast.success("Status updated successfully!");
        fetchTranquilityList();
      },
      onError: () => {
        toast.error("Failed to update status.");
      },
    },
  );

  const handleDelete = () => {
    TranquilityApi.deleteTranquility(_id).then((res) => {
      if (res && res.message) {
        handleSuccess(res.message);
        setOpenDeleteModal(false);
      }
    });
  };

  // Handle badge click
  const handleBadgeClick = () => {
    setCurrentStatus(status || "Active");
    setOpenStatusModal(true);
  };

  // Handle update tranquility status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: _id, status: currentStatus });
    setOpenStatusModal(false);
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

  useEffect(() => {
  if (videoRef.current && video && video.length > 0) {
    videoRef.current.load(); // This forces the video to reload its source
  }
}, [video]);

  return (
    <StyledCard>
      <ConfirmDialog
        title="Delete Tranquility?"
        dialogContext="Are you sure to delete this tranquility?"
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <CustomStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={handleUpdateStatus}
        status={currentStatus}
        setStatus={setCurrentStatus}
      />
      <CustomDialog
        title="Update Tranquility"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        maxWidth="md"
      >
        <CreateTranquility tranquilityData={tranquilityData} setOpen={setOpenUpdateModal} />
      </CustomDialog>
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
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
        <Box p={0.5} pl={1.5} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ maxWidth: 220, textAlign: 'left', flexGrow: 1 }}>
            <Typography
              overflow="hidden"
              sx={{ fontSize: "13px", fontWeight: 500, mb: 0, mt: 0 }}
            >
              {title}
            </Typography>
            <CustomDescriptionParser description={description} limit={2} />
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} sx={{ marginTop: 'auto' }}>
            <CustomBadge
              badgeContent={status || "Active"}
              onClick={handleBadgeClick}
            />
            <Box display="flex" gap={1} alignItems="center">
              <IconButton aria-label="edit" onClick={() => setOpenUpdateModal(true)}>
                <img src={`/icons/edit.svg`} alt="edit" />
              </IconButton>
              <IconButton aria-label="delete" onClick={() => setOpenDeleteModal(true)}>
                <img src={`/icons/trash.svg`} alt="trash" />
              </IconButton>
            </Box>
          </Box>
                 </Box>
       </Box>
     </StyledCard>
   );
};

export default SingleTranquility;
