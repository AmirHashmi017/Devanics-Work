import React from "react";
import {
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { statusOptions } from "../../constants";
import CustomButton from "../Button";
import { Close } from "@mui/icons-material";

import { StyledDialog, StyledDialogTitle } from "./style";
const CustomStatusDialog = ({ open, onClose, onUpdate, status, setStatus }) => {
  const theme = useTheme();
  return (
    <StyledDialog
      open={open}
      // onClose={onClose}
    >
      <StyledDialogTitle>
        <Typography variant="subtitle1"> Update status</Typography>

        <IconButton
          onClick={onClose}
          sx={{ color: theme.palette.common.white }}
        >
          <Close />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item md={12} xs={12}>
            <Autocomplete
              value={status}
              onChange={(event, newValue) => setStatus(newValue)}
              options={statusOptions}
              renderInput={(params) => <TextField {...params} label="Status" />}
              fullWidth
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ mx: 2 }}>
        {/* <Button onClick={onClose} variant="contained" color="info">
          Cancel
        </Button> */}
        <CustomButton onClick={onUpdate} loading={null} fullWidth>
          Update
        </CustomButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default CustomStatusDialog;
