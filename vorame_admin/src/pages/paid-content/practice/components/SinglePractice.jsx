import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import { ConfirmDialog } from "components";
import { toast } from "react-toastify";
import CustomDialog from "components/Modal";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import CreatePractice from "./CreatePractice";
import CustomDescriptionParser from "components/DescriptionParser";
import { vorameColors } from "theme/constants";
import PracticeApi from "services/api/practice";

const IMAGE_HEIGHT = 229;
const CARD_MAX_WIDTH = 290;

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

  return (
    <Box
      borderRadius="12px"
      bgcolor="white"
      border="1px solid #EAECEE"
      maxWidth={`${CARD_MAX_WIDTH}px`}
      width="100%"
      p="12px"
      m={1}
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
              height: `${IMAGE_HEIGHT}px`,
              objectFit: "cover",
              borderRadius: "4px",
              background: "#f0f0f0",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: `${IMAGE_HEIGHT}px`,
              background: "#f0f0f0",
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
      <Box flex={1} mt={3} display="flex" flexDirection="column" justifyContent="space-between">
        <CustomDescriptionParser
          description={description || ""}
          limit={2}
          color={vorameColors.lightSlateGrey}
          onExpandChange={setDescExpanded}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
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
            {currentStatus}
          </Button>
          <Box display="flex" gap={2}>
            <Box
              component="img"
              height="20px"
              width="20px"
              src="/icons/edit.svg"
              onClick={() => setOpenUpdateModal(true)}
              alt="edit"
            />
            <Box
              component="img"
              height="20px"
              width="20px"
              src="/icons/trash.svg"
              onClick={() => setOpenDeleteModal(true)}
              alt="trash"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SinglePractice;