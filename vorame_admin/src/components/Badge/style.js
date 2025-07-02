import { styled } from "@mui/material/styles";
import { Badge } from "@mui/material";

// Custom badge style

export const StyledBadge = styled(Badge)(({
  theme,
  badgeContent,
  ...props
}) => {
  return {
    marginLeft: theme.spacing(3.5),
    cursor: "pointer",
    letterSpacing: "1px",
    fontWeight: 400,

    "& .MuiBadge-badge": {
      backgroundColor:
        badgeContent === "Active"
          ? theme.palette.info.green
          : theme.palette.grey[300],
      color:
        badgeContent === "Active"
          ? theme.palette.common.white
          : theme.palette.common.dark,
    },
  };
});
