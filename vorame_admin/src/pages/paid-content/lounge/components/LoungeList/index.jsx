import React, { useState } from "react";
import { Box, Grid, IconButton, Typography, Avatar } from "@mui/material";
import { Add } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useMutation } from "react-query";

import {
  ConfirmDialog,
  CustomBadge,
  CustomButton,
  CustomStatusDialog,
} from "components";

import { CreateLounge } from "..";

import LoungeApi from "../../../../../services/api/lounge";
import { StyledCard } from "./style";

const LoungeList = ({ data, refetch }) => {
  const [loungeID, setLoungeID] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [deleteID, setDeleteID] = useState(null);

  // Update lounge status mutation
  const updateStatusMutation = useMutation(
    (data) => LoungeApi.updateStatus(data),
    {
      onSuccess: () => {
        toast.success("Status updated successfully!");
        refetch();
      },
      onError: () => {
        toast.error("Failed to update status.");
      },
    }
  );

  // Handle badge click
  const handleBadgeClick = (blog) => {
    setLoungeID(blog._id);
    setStatus(blog.status);
    setDialogOpen(true);
  };

  // Hanlde open delete confrim
  const handleConfirmOpen = (id) => {
    setDeleteID(id);
    setConfirmOpen(true);
  };

  // Handle delete lounge
  const handleDelete = async (event) => {
    event.preventDefault();
    const response = await LoungeApi.deleteLounge(deleteID);
    if (response?.statusCode === 200) {
      toast.success(response.message);
      setConfirmOpen(false);
      setDeleteID(null);
      refetch();
    } else {
      toast.error("Lounge not deleted!");
    }
  };

  // Handle update lounge  status method
  const handleUpdateStatus = () => {
    updateStatusMutation.mutate({ id: loungeID, status });
    setDialogOpen(false);
  };

  // Handle open create and update lounge dialog
  const handleClickOpen = (id) => {
    if (id) {
      setLoungeID(id);
    }
    setOpenCreateDialog(true);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" gap={2} sx={{ mt: 3 }}>
        <Typography sx={{fontSize: "24px", fontWeight: 600,}}>Lounge</Typography>
        <CustomButton startIcon={<Add />} onClick={() => handleClickOpen(null)}>
          Add
        </CustomButton>
      </Box>

      {data && data.length > 0 ? (
        <>
          <Grid
            container
            rowSpacing={3}
            columnSpacing={2}
            sx={{ overflowY: "auto", mt: 1 }}
          >
            {data &&
              data.map((lounge, index) => (
                <Grid item lg={4} sm={6} xs={12} key={index}>
                  <StyledCard bgColor={lounge?.color}>
                    <Avatar
                      alt="Lounge"
                      src={`${lounge.file[0]?.url}`}
                      sx={{ width: "50px", height: "50px" }}
                    />
                    <Typography
                      sx={{
                        fontWeight: 500,
                        fontSize: 20,
                        color: "#606162",
                      }}
                    >
                      {lounge.category}
                    </Typography>

                    <Grid
                      sx={{ mt: "12px", justifyContent: "space-between" }}
                      container
                    >
                      <Grid item xs={6}>
                        <CustomBadge
                          badgeContent={lounge?.status}
                          onClick={() => handleBadgeClick(lounge)}
                        />
                      </Grid>
                      <Grid item xs={6} textAlign="right">
                        <IconButton
                          aria-label="edit"
                          onClick={() => handleClickOpen(lounge?._id)}
                        >
                          <img
                            src="icons/edit.svg"
                            alt="edit"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleConfirmOpen(lounge?._id)}
                        >
                          <img
                            src="icons/trash.svg"
                            alt="delete"
                            style={{ width: "20px", height: "20px" }}
                          />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </StyledCard>
                </Grid>
              ))}
          </Grid>
        </>
      ) : (
        <Grid>
          <Typography variant="subtitle1">
            Currently loungs not exists.
          </Typography>
        </Grid>
      )}

      {/* Create and update lounge dialog */}
      <CreateLounge
        open={openCreateDialog}
        setOpen={setOpenCreateDialog}
        id={loungeID}
        setID={setLoungeID}
        refetch={refetch}
      />

      {/* Dialog for update status of lounge */}
      <CustomStatusDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onUpdate={handleUpdateStatus}
        status={status}
        setStatus={setStatus}
      />

      {/* Delete Lounge Dialog */}
      <ConfirmDialog
        title="Delete Lounge ?"
        dialogContext="Are you sure to delete lounge ?"
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default LoungeList;
