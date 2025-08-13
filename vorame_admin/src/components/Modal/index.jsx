import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

const CustomDialog = ({ title, open, onClose, children, maxWidth }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} PaperProps={{
      sx: {
        width: '100%',
        maxWidth: maxWidth ? (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth) : '650px',
        borderRadius: '12px',
      }
    }}>
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
    </Dialog>
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
  background: "white",
  borderBottom: "0.5px solid #EAECEE",
  color: theme.palette.common.dark,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
