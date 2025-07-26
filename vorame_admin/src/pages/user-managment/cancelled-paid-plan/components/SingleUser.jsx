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
    purchaseHistory={},

  } = userData || {};

  const { name = "-" } = plan || {};
  const {startDate="-"}= purchaseHistory || {};
  const {updatedAt="-"}= purchaseHistory || {};
  const {reason="-"}= purchaseHistory || {};

  return (
    <>
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell align="left">{firstName || "-"}</TableCell>
        <TableCell align="center">{lastName || "-"}</TableCell>
        <TableCell align="center">{email}</TableCell>
        <TableCell align="center">{name}</TableCell>
        <TableCell align="center">
          {moment(startDate).format("DD-MM-YYYY")}
        </TableCell>
        <TableCell align="center">
          {moment(updatedAt).format("DD-MM-YYYY")}
        </TableCell><TableCell align="center">
          {reason}
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
                fontWeight={500}
              >
                {isActive}
              </Typography>
            </Box>
          </Box>
        </TableCell>
       
      </TableRow>
    </>
  );
};

export default SingleUser;
