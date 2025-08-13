import { styled } from "@mui/material/styles";
import { CardMedia, Card, IconButton } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: "12px",
  minHeight: 442,
  marginBottom: 2,
  boxShadow: "none",
  backgroundColor: "white",
  border: `1px solid #EAECEE`,
  [theme.breakpoints.down("md")]: {
    borderRadius: "12px",
    minHeight: 442,
  },
}));

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  position: "relative",
  cursor: "pointer",
  border: "none",
  borderRadius: "12px 12px 0 0",
  overflow: "hidden",
}));

export const StyledVideo = styled("video")(({ theme }) => ({
  objectFit: "cover",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "270px",
  border: "none",
  borderRadius: "12px 12px 0 0",
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
