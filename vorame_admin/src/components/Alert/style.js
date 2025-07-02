import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";

export const StyledAlertBox = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: theme.breakpoints.down("sm") ? theme.spacing(12) : theme.spacing(20),

  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 1,
  width: theme.breakpoints.down("sm") ? "80%" : "90%",
  maxWidth: "500px",
}));
