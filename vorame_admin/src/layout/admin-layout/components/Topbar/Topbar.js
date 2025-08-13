import React from "react";
import { useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { StyledTitleBox } from "./style";
import { useAuth } from "../../../../hooks/useAuth";
import TopNav from "../Sidebar/TopNav";

export default function PrimarySearchAppBar({ handleDrawerToggle }) {
  const theme = useTheme();
  const { signout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const menuId = "primary-search-account-menu";

  const handleLogout = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
    localStorage.clear();         // ✅ Clear localStorage
    signout();                    // ✅ Custom cleanup logic
    toast.success("Logout successfully");
    navigate("/login");          // ✅ Redirect to login
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMoreAnchorEl(null);
  };

  const ProfileMenu = () => (
    <Menu
      sx={{ mt: 4 }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      disableScrollLock
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>
        <Typography textAlign="center">Logout</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box display="flex" justifyContent="space-between" width={1}>
      <Box width={1} display="flex" flex={1} justifyContent="center">
        <AppBar
          position="static"
          sx={{ backgroundColor: theme.palette.common.white, width: 1, p: 0 , boxShadow: "none !important", border: "1.5px solid #EAECEE"}}
        >
          <Box maxWidth={1400} width={1} mx="auto">
            <Toolbar sx={{ color: theme.palette.common.black }}>
              {/* Menu Icon for mobile */}
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>

              {/* Sidebar top nav container */}
              <TopNav>
                <ProfileMenu />
              </TopNav>

              {/* Grow the right section */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Desktop right icons */}
              <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
                {/* Notification Icon */}
                <IconButton size="large" color="inherit">
                  <Badge badgeContent={1} color="error">
                    <img src={`/icons/bell.svg`} alt="Notification" />
                  </Badge>
                </IconButton>

                {/* User icon */}
                <IconButton size="large" edge="end" color="inherit">
                  <img src={`/icons/group.svg`} alt="User" />
                </IconButton>

                {/* Title Box */}
                <StyledTitleBox>
                  <Typography variant="subtitle2">Admin</Typography>
                </StyledTitleBox>

                {/* Admin dropdown menu */}
                <IconButton
                  size="large"
                  edge="end"
                  aria-label="admin menu"
                  aria-controls={menuId}
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <img src={`/icons/create-down.svg`} alt="Menu" />
                </IconButton>
              </Box>

              {/* Mobile more icon */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="show more"
                  aria-haspopup="true"
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                >
                  <img src={`/icons/dots-vertical.svg`} alt="More" />
                </IconButton>
              </Box>
            </Toolbar>
          </Box>
        </AppBar>
      </Box>

      {/* Admin Dropdown Menu */}
      <ProfileMenu />
    </Box>
  );
}
