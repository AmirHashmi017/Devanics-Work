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
  right: 16,
  zIndex: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: theme.palette.common.white,
  fontWeight: "bold",
  fontSize: "2rem",
}));

// Login button
export const StyledTypographyButton = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  fontWeight: "bold",
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
}));

// Not receive reset link
export const StyledTypography = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
}));

// Resned link
export const StyledLink = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
}));

export const StyledForgotEmail = styled(Typography)(({ theme }) => ({
  cursor: "pointer",
}));

// Card grid
export const CardGrid = styled(Grid)(({ theme }) => ({
  // padding: theme.spacing(5),
  // margin: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

// Bottom Link Grid
export const StyledLinkGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  textAlign: "start",
  justifyContent: "space-between",
  marginTop: 30,
}));

export const TitleGrid = styled(Grid)(({ theme }) => ({
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  marginBottom: 5,
}));
