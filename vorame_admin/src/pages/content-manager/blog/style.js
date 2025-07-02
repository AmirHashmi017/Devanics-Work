import { styled } from "@mui/material/styles";
import { CardMedia } from "@mui/material";

export const StyledCardMedia = styled(CardMedia)(() => ({
  objectFit: "cover",
  height: "229px",
  borderRadius: '4px',
  // maxWidth: 242,
  width: "100%",
}));
