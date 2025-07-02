import { styled } from "@mui/material/styles";
import { Dialog, DialogTitle, InputLabel } from "@mui/material";

// Styled dialog
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    "& .MuiPaper-root": {
      maxWidth: 670,
      // height: 700,
      borderRadius: 20,
      
    },
  },
}));

// Styled dialog title
export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  // background: theme.palette.grey[300],
  color: theme.palette.common.dark,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.common.dark,
  // fontWeight: "bold",
  fontSize: "16px",
}));
