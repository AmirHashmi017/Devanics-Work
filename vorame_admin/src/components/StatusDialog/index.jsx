import React from "react";
import {
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
  Typography,
  FormLabel,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Close } from "@mui/icons-material";

import { StyledDialog, StyledDialogTitle } from "./style";
import CustomButton from "../Button";

const CustomStatusDialog = ({ open, onClose, onUpdate, status, setStatus }) => {
  const theme = useTheme();

  return (
    <StyledDialog open={open}>
      <StyledDialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          borderBottom: "1px solid #e5e7eb",
          paddingBottom:"7px", 
          marginBottom:"10px",
        }}
      >
        Update Status
        <IconButton
          onClick={onClose}
          sx={{ color: theme.palette.common.black, position: "absolute", right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="body2" sx={{ color: "#6B7280", mb: 2 }}>
          Do you want to change status?
        </Typography>

        <RadioGroup
          row
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <FormControlLabel
            value="Active"
            control={<Radio />}
            label="Active"
          />
          <FormControlLabel
            value="Inactive"
            control={<Radio />}
            label="Inactive"
          />
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, display:"flex", justifyContent:"space-between", paddingBottom:"1px" }}>
        <CustomButton
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#D1D5DB",
            color: "#1F2937",
            fontWeight: 500,
            borderRadius: "8px",
            px: 3,
          }}
        >
          Cancel
        </CustomButton>

        <CustomButton
          onClick={onUpdate}
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "8px",
            px: 3,
            '&:hover': {
              backgroundColor: "#111",
            },
          }}
        >
          Update
        </CustomButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CustomStatusDialog;
