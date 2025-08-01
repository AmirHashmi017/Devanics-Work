import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmationModal = ({ open, onClose, onConfirm, heading, text, imgSrc, cancelBtnText, confirmBtnText }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 3,
          width: 380,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* User Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#D1FADF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
            <img src={imgSrc} alt="person-icon" className="block-user-icon" />
        </Box>

        {/* Close Button */}
        <IconButton onClick={onClose}>
          <CloseIcon sx={{ color: "#6B7280" }} />
        </IconButton>
      </Box>

      <DialogTitle sx={{ textAlign: "left", p: 0, mb: 1 }}>
        <Typography variant="h6" fontWeight={600}>
          {heading}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "left", p: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {text}
        </Typography>
      </DialogContent>

      {/* Buttons */}
      <DialogActions
        sx={{
          mt: 4,
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#D1D5DB",
            color: "#374151",
            width: 170,
            fontWeight: 500,
            borderRadius: "8px",
          }}
        >
          {cancelBtnText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            textTransform: "none",
            backgroundColor: "#1F2937",
            "&:hover": {
              backgroundColor: "#111827",
            },
            color: "white",
            width: 170,
            fontWeight: 500,
            borderRadius: "8px",
          }}
        >
          {confirmBtnText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
