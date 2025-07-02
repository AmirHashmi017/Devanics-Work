import { styled } from "@mui/material/styles";
import { Tab } from "@mui/material";
import TabList from "@mui/lab/TabList";

// Styled Tab List component
export const StyledTabList = styled(TabList)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    backgroundColor: theme.palette.common.dark,
  },
}));
// Styled Tab component
export const StyledTab = styled(Tab)(({ theme }) => ({
  minWidth: "auto",
  padding: "12px 12px",
  fontSize: "0.8rem",
  fontWeight: "bold",
  textTransform: "none",
  "&.Mui-selected": {
    color: theme.palette.common.dark,
    fontWeight: "bold",
  },
}));
