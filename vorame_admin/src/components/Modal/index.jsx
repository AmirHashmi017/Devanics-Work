import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

const CustomDialog = ({ title, open, onClose, children }) => {
  const theme = useTheme();

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle sx={{
              fontWeight: 600,
              fontSize: 20,
              color: "#101828",
            }}>
        {title}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </StyledDialog>
  );
};

export default CustomDialog;

// Styled dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    "& .MuiPaper-root": {
      width: "100%",
      maxWidth: '650px',
      borderRadius: '12px',
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "#F4F7FA",
  color: theme.palette.common.dark,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
