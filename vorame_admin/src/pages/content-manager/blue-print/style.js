import { styled } from "@mui/material/styles";
import { CardMedia, Card } from "@mui/material";
import { shadows } from "theme/constants";

export const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  borderRadius: '14px',
  height: 320,
  boxShadow: shadows.softDepthShadow,
  padding: 10,
}));

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  objectFit: "cover",
  [theme.breakpoints.up("md")]: {
    paddingLeft: theme.spacing(20),
    paddingRight: theme.spacing(20),
    // marginTop: theme.spacing(1),
  },
  [theme.breakpoints.down("lg")]: {
    paddingLeft: theme.spacing(0),
    paddingRight: theme.spacing(0),
  },
}));
