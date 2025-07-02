// index.js
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

// Styled Grid component
export const StyledGrid = styled(Grid)(({ theme }) => ({
  minHeight: "95vh",
  width: "99%",
  position: "relative",
  // backgroundImage: `url('/images/login.png')`,
  backgroundSize: "contain",
  backgroundPosition: "right center",
  backgroundRepeat: "no-repeat",
  padding: 26,
  marginLeft: 8,
  backgroundColor: theme.palette.background.default,
}));

// Styled Box component
export const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 16,
  left: 16,
  zIndex: 1,
  color: theme.palette.common.white,
  fontWeight: "bold",
  fontSize: "2rem",
}));

export const StyledLink = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
}));
