import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";
import { ExpandMore } from "@mui/icons-material";

import CustomDialog from "components/Modal";
import CreateJob from "./CreateJob";
import { ConfirmDialog } from "components";
import useApiMutation from "hooks/useApiMutation";
import { CAREERS, CAREER_LIST, CAREER } from "services/constants";

const SingleJob = ({
  _id,
  title,
  location,
  createdAt,
  lastDate,
  description,
  totalApplicants,
  status = "Open", // Default status
}) => {
  const [optionsMenuAnchor, setOptionsMenuAnchor] = useState(null);
  const [statusMenuAnchor, setStatusMenuAnchor] = useState(null);
  const isOptionsMenuOpen = Boolean(optionsMenuAnchor);
  const isStatusMenuOpen = Boolean(statusMenuAnchor);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status);

  // Update selectedStatus when status prop changes
  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  const fetchJobList = () => {
    queryClient.invalidateQueries({ queryKey: [CAREERS] });
    queryClient.invalidateQueries({ queryKey: [CAREER_LIST] });
  };

  const handleDelete = () => {
    mutate(
      { method: "delete", url: `${CAREER}/${_id}` },
      {
        onSuccess: ({ message }) => {
          toast.success(message || "Job deleted successfully");
          setOpenDeleteModal(false);
          fetchJobList();
        },
        onError: () => {
          toast.error("Failed to delete job");
        },
      }
    );
  };

  const handleStatusUpdate = (newStatus) => {
    mutate(
      { 
        method: "post", 
        url: `${CAREER}/status`, 
        data: { id: _id, status: newStatus } 
      },
      {
        onSuccess: ({ message }) => {
          toast.success(message || "Job status updated successfully");
          setSelectedStatus(newStatus);
          fetchJobList();
        },
        onError: () => {
          toast.error("Failed to update job status");
        },
      }
    );
  };

  const handleOptionsMenuClick = (event) =>
    setOptionsMenuAnchor(event.currentTarget);
  const handleOptionsMenuClose = () => setOptionsMenuAnchor(null);

  const handleStatusMenuClick = (event) =>
    setStatusMenuAnchor(event.currentTarget);
  const handleStatusMenuClose = () => setStatusMenuAnchor(null);

  const handleStatusSelection = (newStatus) => {
    handleStatusUpdate(newStatus);
    handleStatusMenuClose();
  };

  return (
    <>
      <ConfirmDialog
        title="Delete Job"
        dialogContext="Are you sure you want to delete this job?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />

      <CustomDialog
        title="Update Job"
        open={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
      >
        <CreateJob
          JobData={{
            _id,
            title,
            location,
            createdAt,
            lastDate,
            description,
            totalApplicants,
            status,
          }}
          setOpen={setOpenUpdateModal}
        />
      </CustomDialog>

      <TableRow>
        <TableCell align="left">
          <Typography sx={{ fontSize: "14px", color: "#475467" }}>
            {title || "-"}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: "14px", color: "#475467" }}>
            {location || "-"}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: "14px", color: "#475467" }}>
            {moment(createdAt).format("DD-MM-YYYY")}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: "14px", color: "#475467" }}>
            {moment(lastDate).format("DD-MM-YYYY")}
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
            {selectedStatus}
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
            <MenuItem onClick={() => handleStatusSelection("Closed")}>Closed</MenuItem>
          </Menu>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontSize: "14px", color: "#475467" }}>
            {totalApplicants ?? 0} Applicants
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Box display="flex" justifyContent="center">
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
              <MenuItem onClick={() => navigate(`/job/${_id}`)}>
                View Details
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenUpdateModal(true);
                  handleOptionsMenuClose();
                }}
              >
                Update Job
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setOpenDeleteModal(true);
                  handleOptionsMenuClose();
                }}
              >
                Delete Job
              </MenuItem>
            </Menu>
          </Box>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SingleJob;
