import { styled } from "@mui/material/styles";
import { InputLabel } from "@mui/material";

export const StyledLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.common.dark,
  fontWeight: "medium",
  fontSize: "14px",
}));
