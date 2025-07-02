import { styled } from "@mui/material/styles";
import ListItemButton from "@mui/material/ListItemButton";
import { Box } from "@mui/material";

// List item button
export const StyledListItemButton = styled(ListItemButton)(
  ({ theme, isActive }) => ({
    borderRadius: theme.shape.borderRadius,
    margin: "0 10px 5px",
    backgroundColor: isActive
      ? theme.palette.common.dark
      : theme.palette.background.paper,
    color: isActive ? theme.palette.common.white : theme.palette.text.primary,
    "& .MuiListItemIcon-root": {
      minWidth: 30,
      color: isActive ? theme.palette.common.white : theme.palette.text.primary,
    },
    // "&:hover": {
    //   backgroundColor: theme.palette.common.dark,
    //   color: theme.palette.common.white,
    //   "& .MuiListItemIcon-root img": {
    //     filter: "brightness(0) invert(1)",
    //   },
    // },
  }),
);

// Styled Box
export const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "16px 0",
}));

// Styled List
export const StyledList = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: 900,
  display: 'flex',
  bgcolor: "background.paper",
}));
