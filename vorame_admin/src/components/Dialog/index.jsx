import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = (props) => {
  const {
    title,
    dialogContext,
    open,
    setOpen,
    onConfirm,
    isLoading = false,
  } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {dialogContext}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="inherit" onClick={handleClose}>
          No
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          disabled={isLoading}
          autoFocus
        >
          {isLoading ? "Yes..." : "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
