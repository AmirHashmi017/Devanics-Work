import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

import CustomDialog from "components/Modal";
import CreateJob from "./CreateJob";
import { ConfirmDialog } from "components";
import useApiMutation from "hooks/useApiMutation";
import { PROMOTION } from "services/constants";

const SingleJob = ({
  _id,
  title,
  location,
  createdAt,
  lastDate,
  totalApplicants,
}) => {
  const [optionsMenuAnchor, setOptionsMenuAnchor] = useState(null);
  const isOptionsMenuOpen = Boolean(optionsMenuAnchor);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  const fetchPromoList = () =>
    queryClient.invalidateQueries({ queryKey: "promotions" });

  const handleDelete = () => {
    mutate(
      { method: "delete", url: `${PROMOTION}/${_id}` },
      {
        onSuccess: ({ message }) => {
          toast.success(message || "Promotion deleted");
          setOpenDeleteModal(false);
          fetchPromoList();
        },
        onError: () => {
          toast.error("Failed to delete promotion");
        },
      }
    );
  };

  const handleOptionsMenuClick = (event) =>
    setOptionsMenuAnchor(event.currentTarget);
  const handleOptionsMenuClose = () => setOptionsMenuAnchor(null);

  return (
    <>
      <ConfirmDialog
        title="Delete Promotion"
        dialogContext="Are you sure you want to delete this promotion?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />

      <CustomDialog
        title="Update Promotion"
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
            totalApplicants,
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
                End Job
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
