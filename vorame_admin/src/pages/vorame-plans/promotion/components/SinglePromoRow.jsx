import React, { useState } from "react";
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  Menu,
  MenuItem,
  IconButton
} from "@mui/material";
import { ConfirmDialog } from "components";
import useApiMutation from "hooks/useApiMutation";
import { useQueryClient } from "react-query";
import { PROMO } from "services/constants";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from "moment";

const SinglePromoRow = (promoData) => {
  const { code, amount, appliedTo, startDate, endDate, _id, plansMap } = promoData;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useApiMutation();

  // Map plan name from appliedTo object
  const planName = appliedTo && appliedTo.name ? appliedTo.name : '-';

  const fetchPromoList = () => queryClient.invalidateQueries({ queryKey: 'promos' });

  const handleDelete = () => {
    mutate({ method: 'delete', url: PROMO + `delete/${_id}` }, {
      onSuccess: () => {
        setOpenDeleteModal(false);
        fetchPromoList();
      }
    });
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ConfirmDialog
        title="Delete Promo Code ?"
        dialogContext="Are you sure to delete promo ?"
        open={openDeleteModal}
        isLoading={isLoading}
        setOpen={setOpenDeleteModal}
        onConfirm={handleDelete}
      />
      <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
        <TableCell align="left">
          <Typography sx={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px", color: "#475467" }}>{code}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px", color: "#475467" }}>{amount ? `${amount}%` : '-'}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px", color: "#475467" }}>{planName}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px", color: "#475467" }}>{startDate ? moment(startDate).format('MM-DD-YYYY') : '-'}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography sx={{ fontFamily: "Work Sans", fontWeight: 400, fontSize: "14px", color: "#475467" }}>{endDate ? moment(endDate).format('MM-DD-YYYY') : '-'}</Typography>
        </TableCell>
        <TableCell align="center">
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MenuItem
              onClick={() => {
                setOpenDeleteModal(true);
                handleMenuClose();
              }}
              sx={{ color: 'black' }}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
};

export default SinglePromoRow; 