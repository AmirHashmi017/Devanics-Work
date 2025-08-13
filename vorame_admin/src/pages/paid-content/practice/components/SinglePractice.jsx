import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ConfirmDialog, CustomBadge } from "components";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import CreatePractice from "./CreatePractice";
import CustomDescriptionParser from "components/DescriptionParser";
import { vorameColors } from "theme/constants";
import { grey } from "@mui/material/colors";
import PracticeApi from "services/api/practice";

const SinglePractice = ({ practiceData, onAction }) => {
  const { _id, description, file, status } = practiceData;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await PracticeApi.deletePractice(_id);
      if (response && response.message) {
        toast.success(response.message);
        setOpenDeleteModal(false);
        if (onAction) onAction();
      } else {
        toast.error(response?.error || "Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const updateStatusHandler = async (newStatus) => {
    setLoading(true);
    try {
      const response = await PracticeApi.updatePracticeStatus({ id: _id, status: newStatus });
      if (response && response.message) {
        toast.success(response.message);
        setCurrentStatus(newStatus);
        setOpenStatusModal(false);
        if (onAction) onAction();
      } else {
        toast.error(response?.error || "Status update failed");
      }
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBadgeClick = () => {
    setOpenStatusModal(true);
  };

  return (
    <Box
      borderRadius="12px"
      py="12px"
      px={2}
      border={1}
      borderColor={grey[200]}
      bgcolor="white"
      maxWidth="320px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{ height: descExpanded ? 'auto' : '420px', minHeight: '430px', transition: 'height 0.3s' }}
    >
      <ConfirmDialog
        title="Delete Practice ?"
        dialogContext="Are you sure to delete this practice?"
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
        isLoading={loading}
      />
      <CustomDialog
        title="Update Practice"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreatePractice
          practiceData={practiceData}
          setOpen={setOpenUpdateModal}
          onSuccess={onAction}
        />
      </CustomDialog>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        status={currentStatus}
        isLoading={loading}
      />
      
      <Box display="flex" justifyContent="center">
        {file && file.length > 0 ? (
          <Box
            component="img"
            src={file[0].url}
            alt="concept-img"
            sx={{
              width: "100%",
              height: "229px",
              objectFit: "cover",
              borderRadius: "4px",
              background: "#f0f0f0",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "229px",
              background: "#f0f0f0",
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
      
      <Box className="practice-details" mt={3}>
        <CustomDescriptionParser
          description={description || ""}
          limit={2}
          color={vorameColors.lightSlateGrey}
          onExpandChange={setDescExpanded}
        />

        <Box display="flex" justifyContent="space-between" mt={2}>
          <CustomBadge
            badgeContent={currentStatus}
            onClick={handleBadgeClick}
          />
          <Box>
            <IconButton
              aria-label="edit"
              onClick={() => setOpenUpdateModal(true)}
            >
              <img src={`icons/edit.svg`} alt="edit" />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={() => setOpenDeleteModal(true)}
            >
              <img src={`icons/trash.svg`} alt="delete" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SinglePractice;