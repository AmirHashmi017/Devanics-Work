import { styled } from "@mui/material/styles";
import { Dialog, DialogTitle } from "@mui/material";

// Styled dialog
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-container": {
    "& .MuiPaper-root": {
      width: "100%",
      maxWidth: "430px",
      borderRadius: "15px",
      paddingBottom: theme.spacing(4),
    },
  },
}));

// Styled dialog title
export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  // background: theme.palette.grey[300],
  // color: theme.palette.common.dark,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "2px solid lightgray"
}));
