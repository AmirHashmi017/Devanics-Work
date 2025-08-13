import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  Link,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from "@mui/material";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { USER } from "constants";
import { ConfirmDialog } from "components";
import ConfirmationModal from "../../../../../components/Modal/ConfirmationModal";
import PostApi from "services/api/post";
import { DELETE_MESSAGE } from "services/constants";
import api from "utils/axios";
import CloseIcon from '@mui/icons-material/Close';

const SingleUser = (report) => {
  // All hooks at the top!
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const queryClient = useQueryClient();
  const [isBlocked, setIsBlocked] = useState(false);
  const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
  const [openBlockDialog, setOpenBlockDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { mutate, isLoading } = useApiMutation();
  const [openMessageModal, setOpenMessageModal] = useState(false);

  // Now destructure props
  const { refetchReports } = report;
  const {
    _id,
    messageId,
    reportCategory = [],
    createdAt,
    reportedBy = {},
    reportedUser = {},
    message = "",
  } = report || {};

  // Early return after hooks
  if (!messageId) return null;
  console.log(report)
  // Fallbacks for user info
  const reportedUserName = reportedUser?.firstName || reportedUser?.name || "-";
  const reportedByName = reportedBy?.firstName || reportedBy?.name || "-";
  const reportedUserAvatar = reportedUser?.avatar || "/images/user-profile.png";
  const reportedByAvatar = reportedBy?.avatar || "/images/user-profile.png";

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${day} ${month}, ${year} at ${hours}:${minutes}${ampm}`;
  };

  // 3-dot menu and block/unblock logic
  const fetchUserList = () => queryClient.invalidateQueries({ queryKey: "lounge-reports" });

  const handleDelete = () => {
    mutate(
      { method: "patch", url: USER + `/${_id}`, data: { deleted: true } },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenDeleteModal(false);
        },
      }
    );
  };

  const handleSuccess = (message) => {
    toast.success(message);
    fetchUserList();
  };

  const updateStatusHandler = (status) => {
    mutate(
      { method: "patch", url: USER + `/${_id}`, data: { isActive: status } },
      {
        onSuccess: ({ message }) => {
          handleSuccess(message);
          setOpenStatusModal(false);
        },
      }
    );
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleBlockUser = async () => {
    try {
      const response = await PostApi.blockUser(reportedUser._id);
      if (response && response.message) {
        toast.success(response.message);
        setIsBlocked(true);
        if (typeof refetchReports === 'function') refetchReports();
      } else {
        toast.error("Failed to block user");
      }
    } catch (error) {
      toast.error("Failed to block user");
    }
  };

  const handleUnblockUser = async () => {
    try {
      const response = await PostApi.blockUser(reportedUser._id);
      if (response && response.message) {
        toast.success(response.message);
        setIsBlocked(false);
        setOpenUnblockDialog(false);
        if (typeof refetchReports === 'function') refetchReports();
      } else {
        toast.error("Failed to unblock user");
      }
    } catch (error) {
      toast.error("Failed to unblock user");
    }
  };

  const handleConfirmUnblock = () => {
    setIsBlocked(false);
    setOpenUnblockDialog(false);
    handleBlockUser();
  };

  // Determine block status from user data
  const isActuallyBlocked = Boolean(reportedUser && reportedUser.isBoardroomBlocked) && Boolean(reportedUser && reportedUser.isTouchpointBlocked);

  return (
    <>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={isLoading}
        status={reportedUser ? reportedUser.isActive : undefined}
      />
      <ConfirmDialog
        title="Delete User ?"
        dialogContext="Are you sure to delete user ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell align="left">
          <Box display="flex" gap={1}>
            <Box
              component="img"
              src={reportedUserAvatar}
              alt="Reported User"
              height="22px"
              width="22px"
              sx={{ borderRadius: '50%', objectFit: 'cover' }}
            ></Box>
            <Box>{reportedUserName}</Box>
          </Box>
        </TableCell>
        <TableCell align="center">
          <Box display="flex" gap={1} justifyContent="center">
            {reportCategory.length > 0 ? reportCategory.map((cat, idx) => (
              <Box
                key={idx}
                display="flex"
                gap="4px"
                alignItems="center"
                sx={{
                  bgcolor: "#FEF3F2 !important",
                  borderRadius: "16px",
                  py: "2px",
                  px: 1,
                  justifyContent: "center",
                  maxWidth: "120px",
                }}
              >
                <Typography
                  color="#F68500"
                  fontSize="12px"
                  minWidth={4}
                  textTransform="capitalize"
                  fontWeight={500}
                >
                  {cat}
                </Typography>
              </Box>
            )) : "-"}
          </Box>
        </TableCell>
        <TableCell align="center">{formatDate(createdAt)}</TableCell>
        <TableCell align="left">
          <Box display="flex" gap={1}>
            <Box
              component="img"
              src={reportedByAvatar}
              alt="Reported By"
              height="22px"
              width="22px"
              sx={{ borderRadius: '50%', objectFit: 'cover' }}
            ></Box>
            <Box>{reportedByName}</Box>
          </Box>
        </TableCell>
        <TableCell align="center">{message || "-"}</TableCell>
        <TableCell align="center">
          <Link
            href="#"
            underline="hover"
            sx={{ cursor: "pointer", color: "primary.main" }}
            onClick={e => {
              e.preventDefault();
              setOpenMessageModal(true);
            }}
          >
            View Message
          </Link>{" "}
        </TableCell>
        <TableCell align="center" sx={{ width: "120px", height: "63px" }}>
          <Box display="flex" justifyContent="center">
            {!isActuallyBlocked ? (
              <>
                <Box
                  component="img"
                  src="/icons/dots-vertical.svg"
                  alt="options"
                  height="20px"
                  onClick={handleOpenMenu}
                  sx={{ cursor: "pointer" }}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  disableScrollLock
                  PaperProps={{
                    elevation: 1,
                    sx: {
                      borderRadius: "8px",
                      mt: 1,
                      minWidth: 158,
                      backgroundColor: "#fff",
                      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                      "& .MuiMenuItem-root": {
                        fontSize: "16px",
                        color: "#344054",
                        px: 2,
                        py: 1.5,
                      },
                    },
                  }}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      setOpenBlockDialog(true);
                      handleCloseMenu();
                    }}
                  >
                    Block User
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setOpenDeleteDialog(true);
                      handleCloseMenu();
                    }}
                  >
                    Remove content
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>Send message</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Box
                  onClick={() => setOpenUnblockDialog(true)}
                  sx={{
                    cursor: "pointer",
                    color: "#222222",
                    borderRadius: "4px",
                    px: 1.5,
                    py: 0.5,
                    fontSize: "12px",
                    fontWeight: 500,
                    border: "1px solid #EAECEE",
                  }}
                >
                  Unblock
                </Box>
                <ConfirmationModal
                  open={openUnblockDialog}
                  onClose={() => setOpenUnblockDialog(false)}
                  onConfirm={handleUnblockUser}
                  heading="Unblock this User?"
                  text="Are you sure you want to unblock this user? They will be able to access their account and interact with your platform again."
                  imgSrc="/icons/person-icon.svg"
                  cancelBtnText="Cancel"
                  confirmBtnText="Unblock User"
                />
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>
      <ConfirmationModal
        open={openBlockDialog}
        onClose={() => setOpenBlockDialog(false)}
        onConfirm={async () => {
          await handleBlockUser();
          setOpenBlockDialog(false);
        }}
        heading="Block this User?"
        text="Are you sure you want to block this user? They will not be able to access their account or interact with your platform."
        imgSrc="/icons/person-icon.svg"
        cancelBtnText="Cancel"
        confirmBtnText="Block User"
      />
      <ConfirmationModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={async () => {
          setIsDeleting(true);
          try {
            const res = await api.delete(`${DELETE_MESSAGE}/${messageId._id}`);
            if (res?.status === 200) {
              toast.success(res.data?.message || "Content deleted successfully");
              if (typeof refetchReports === 'function') refetchReports();
            } else {
              toast.error(res?.data?.message || "Unable to delete content");
            }
          } catch (error) {
            toast.error("Unable to delete content");
          } finally {
            setIsDeleting(false);
            setOpenDeleteDialog(false);
          }
        }}
        heading="Remove content?"
        text="Are you sure you want to remove this content? This action cannot be undone."
        imgSrc="/icons/trash.svg"
        cancelBtnText="Cancel"
        confirmBtnText={isDeleting ? "Removing..." : "Remove"}
        isLoading={isDeleting}
      />
      <Dialog
        open={openMessageModal}
        onClose={() => setOpenMessageModal(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            width: 500,
            p: 0,
            overflow: 'hidden',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#F9FAFB', px: 3, py: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Typography id="view-message-modal-title" variant="h6" component="h2" sx={{ fontWeight: 600, fontSize: 20 }}>
            Message
          </Typography>
          <IconButton onClick={() => setOpenMessageModal(false)}>
            <CloseIcon sx={{ cursor: 'pointer' }} />
          </IconButton>
        </Box>
        <DialogContent sx={{ px: 3, py: 2 }}>
          {/* Author and time */}
          {messageId && messageId.postedBy && messageId.createdAt && (
            <Typography sx={{ color: '#667085', fontSize: 13, mb: 1 }}>
              {/* Reported user name logic */}
              {reportedUser && (reportedUser.firstName || reportedUser.lastName)
                ? `${reportedUser.firstName || ''} ${reportedUser.lastName || ''}`.trim()
                : (reportedUser && reportedUser.name ? reportedUser.name : '-')}
              {', '}
              {/* Full date and time */}
              {messageId.createdAt ? (() => {
                const date = new Date(messageId.createdAt);
                const day = date.getDate().toString().padStart(2, '0');
                const month = date.toLocaleString('default', { month: 'long' });
                const year = date.getFullYear();
                let hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                return `${day} ${month}, ${year} at ${hours}:${minutes}${ampm}`;
              })() : '-'}
            </Typography>
          )}
          {/* Message text */}
          <Typography id="view-message-modal-description" sx={{ fontSize: 16, color: '#101828', mb: 3 }}>
            {messageId && messageId.message ? messageId.message : 'No data available'}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'flex-end' }}>
          <Button
            onClick={() => setOpenMessageModal(false)}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#D0D5DD',
              color: '#344054',
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 1,
              px: 3,
              py: 1,
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SingleUser;
