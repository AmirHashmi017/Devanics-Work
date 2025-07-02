import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { USER } from "constants";
import { ConfirmDialog } from "components";
import ConfirmationModal from "../../../../components/Modal/ConfirmationModal";

const SingleUser = (userData) => {
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const queryClient = useQueryClient();
  const [isBlocked, setIsBlocked] = useState(false);
  const [openUnblockDialog, setOpenUnblockDialog] = useState(false);

  const { mutate, isLoading } = useApiMutation();
  const fetchUserList = () =>
    queryClient.invalidateQueries({ queryKey: "users" });
  const {
    _id,
    firstName,
    lastName,
    email,
    createdAt,
    isActive,
    plan = {},
  } = userData || {};

  const { name = "-" } = plan || {};
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

  const handleConfirmUnblock = () => {
    setIsBlocked(false);
    setOpenUnblockDialog(false);
  };

  return (
    <>
      <UpdateStatusDialog
        open={openStatusModal}
        onClose={() => setOpenStatusModal(false)}
        onUpdate={updateStatusHandler}
        isLoading={isLoading}
        status={isActive}
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
        <TableCell align="left">{firstName || "-"}</TableCell>
        <TableCell align="center">{lastName || "-"}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{name}</TableCell>
        <TableCell align="center">
          {moment(createdAt).format("DD-MM-YYYY")}
        </TableCell>
         <TableCell align="center">
          {moment(createdAt).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell align="center">
          <Box width="100%" display="flex" justifyContent="center">
            <Box
              display="flex"
              gap="4px"
              alignItems="center"
              sx={{
                bgcolor: "#ECFDF3 !important",
                borderRadius: "16px",
                py: "2px",
                px: 1,
                justifyContent: "center",
                maxWidth: "63px",
              }}
            >
              <Box
                borderRadius="50%"
                component="span"
                display="inline-block"
                sx={{ bgcolor: "#027A48 !important" }}
                width="6px"
                height="6px"
              />
              <Typography
                color="#027A48"
                fontSize="12px"
                minWidth={4}
                onClick={() => setOpenStatusModal(true)}
                textTransform="capitalize"
                className="cursor-pointer"
                fontWeight={500}
              >
                {isActive}
              </Typography>
            </Box>
          </Box>
        </TableCell>
        <TableCell align="center" sx={{ width: "120px", height: "63px" }}>
          <Box display="flex" justifyContent="center">
            {!isBlocked ? (
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
                      setIsBlocked(true); // Update UI state only
                      handleCloseMenu();
                    }}
                  >
                    Block User
                  </MenuItem>
                  <MenuItem onClick={handleCloseMenu}>Send Message</MenuItem>
                  <MenuItem onClick={handleCloseMenu}>View Profile</MenuItem>
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
                  onConfirm={handleConfirmUnblock}
                  heading = "Unblock this User?"
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
    </>
  );
};

export default SingleUser;
