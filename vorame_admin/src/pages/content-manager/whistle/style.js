import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: 10,
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("md")]: {
    borderRadius: theme.spacing(2),
    padding: 10,
  },
}));
