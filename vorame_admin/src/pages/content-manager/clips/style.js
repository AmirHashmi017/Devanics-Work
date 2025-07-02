import { styled } from "@mui/material/styles";
import { CardMedia, Card, IconButton } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  // justifyContent: "space-between", // Ensures content is spaced with Grid at the bottom
  borderRadius: theme.spacing(3),

  height: 500,
  marginBottom: 2,
  [theme.breakpoints.down("md")]: {
    borderRadius: theme.spacing(2),
    height: 520,
  },
}));

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
}));

export const StyledVideo = styled("video")(({ theme }) => ({
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "300px",
}));

export const StyledMediaIcon = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "white",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
}));
