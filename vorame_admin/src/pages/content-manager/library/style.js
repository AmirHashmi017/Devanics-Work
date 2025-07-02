import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  minHeight: 130,
  padding: 10,

}));
