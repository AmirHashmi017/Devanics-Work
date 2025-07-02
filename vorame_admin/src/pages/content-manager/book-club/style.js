import { styled } from "@mui/material/styles";
import { CardMedia } from "@mui/material";

export const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 322,
  // border: "1px ",
  objectFit: "contain",
  width: '100%',
}));
