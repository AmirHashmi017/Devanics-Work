import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";

export const StyledCard = styled(Card)(({ theme, bgColor }) => ({
  borderRadius: "10px",
  height: "147px",
  padding: 12,
  background: bgColor,
  boxShadow: "none"

}));
