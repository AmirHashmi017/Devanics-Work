import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const StyledDescription = styled(Typography)(
  ({ theme, limitLines, color, fontWeight,  }) => ({
    color: color ?? theme.palette.grey[600],
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: limitLines,
    WebkitBoxOrient: "vertical",
    fontWeight: fontWeight,
  }),
);
