import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const StyledDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.dark,
  margin: 0,
}));
