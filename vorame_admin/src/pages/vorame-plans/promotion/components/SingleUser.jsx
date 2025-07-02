import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  Button, 
} from "@mui/material";
import ConfirmationModal from "../../../../components/Modal/ConfirmationModal";
import UpdateStatusDialog from "components/StatusDialog/StatusDialog";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { USER } from "constants";
import { ExpandMore } from '@mui/icons-material';
import { ConfirmDialog } from "components";

const SingleUser = (userData) => {
  // Status dropdown
  const [selectedValue, setSelectedValue] = useState('Open');
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const isStatusMenuOpen = Boolean(statusMenuAnchor);

  // Options menu
  const [optionsMenuAnchor, setOptionsMenuAnchor] = useState(null);
  const isOptionsMenuOpen = Boolean(optionsMenuAnchor);

  const [openUnblockDialog, setOpenUnblockDialog] = useState(false);
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();
  const fetchUserList = () => queryClient.invalidateQueries({ queryKey: "users" });
  const { _id, firstName, isActive, plan = {} } = userData || {};
  const { name = "-" } = plan || {};

  // Dropdown handlers
  const handleStatusMenuClick = (event) => setStatusMenuAnchor(event.currentTarget);
  const handleStatusMenuClose = () => setStatusMenuAnchor(null);
  const handleStatusSelection = (value) => {
    setSelectedValue(value);
    handleStatusMenuClose();
  };

  const handleOptionsMenuClick = (event) => setOptionsMenuAnchor(event.currentTarget);
  const handleOptionsMenuClose = () => setOptionsMenuAnchor(null);

  const handleDelete = () => {
    mutate(
      { method: "patch", url: USER + `/${_id}`, data: { deleted: true } },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          fetchUserList();
          setOpenDeleteModal(false);
        },
      }
    );
  };

  const updateStatusHandler = (status) => {
    mutate(
      { method: "patch", url: USER + `/${_id}`, data: { isActive: status } },
      {
        onSuccess: ({ message }) => {
          toast.success(message);
          fetchUserList();
          setOpenStatusModal(false);
        },
      }
    );
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
        <TableCell align="left">
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#475467",
            }}
          >
            <Box>{firstName || "-"}</Box>
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#475467",
            }}
          >
            {isActive}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {" "}
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#475467",
            }}
          >
            username1422{" "}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#475467",
            }}
          >
            16-05-2025
          </Typography>
        </TableCell>
        <TableCell align="center">
          {" "}
          <Typography
            sx={{
              fontFamily: "Work Sans",
              fontWeight: 400,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "#475467",
            }}
          >
            16-05-2025{" "}
          </Typography>
        </TableCell>
       <TableCell align="center">
  <Button
    onClick={handleStatusMenuClick}
    endIcon={<ExpandMore />}
    sx={{
      backgroundColor: "#f5f5f5",
      color: "#666",
      textTransform: "none",
      borderRadius: "30px",
      padding: "8px 16px",
      fontSize: "14px",
      fontWeight: 400,
      border: "none",
      boxShadow: "none",
      minWidth: "80px",
      "&:hover": {
        backgroundColor: "#eeeeee",
        boxShadow: "none",
      },
      "& .MuiButton-endIcon": {
        marginLeft: "8px",
        fontSize: "18px",
      },
    }}
  >
    {selectedValue}
  </Button>
  <Menu
    anchorEl={statusMenuAnchor}
    open={isStatusMenuOpen}
    onClose={handleStatusMenuClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    sx={{
      "& .MuiPaper-root": {
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        minWidth: "100px",
      },
    }}
  >
    <MenuItem onClick={() => handleStatusSelection("Open")}>Open</MenuItem>
    <MenuItem onClick={() => handleStatusSelection("Close")}>Close</MenuItem>
  </Menu>
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
          onClick={handleOptionsMenuClick}
          sx={{ cursor: "pointer" }}
        />
        <Menu
          anchorEl={optionsMenuAnchor}
          open={isOptionsMenuOpen}
          onClose={handleOptionsMenuClose}
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
              setIsBlocked(true);
              handleOptionsMenuClose();
            }}
          >
            Block User
          </MenuItem>
          <MenuItem onClick={handleOptionsMenuClose}>Remove content</MenuItem>
          <MenuItem onClick={handleOptionsMenuClose}>Send message</MenuItem>
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
    </>
  );
};

export default SingleUser;
