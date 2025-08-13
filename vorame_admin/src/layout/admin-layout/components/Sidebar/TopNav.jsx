import React from "react";
import { Box, Menu, MenuItem, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const TopNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentMenu, setCurrentMenu] = React.useState(null);

  const handleMenuOpen = (menu, event) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(menu);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const menuItems = {
    contentManager: [
      { text: "After the Whistle", path: "/whistle" },
      { text: "A-Z", path: "/library" },
      { text: "Blogs", path: "/blogs" },
      { text: "BookClub", path: "/bookclub" },
      { text: "Clips", path: "/clips" },
      { text: "Concepts", path: "/concepts" },
      { text: "Careers", path: "/careers" },
      { text: "Lounge", path: "/lounge" },
      { text: "Posts", path: "/posts" },
      { text: "Reported Users", path: "/reported-users" },          
      { text: "Sessions", path: "/events" },
      { text: "Support", path: "/support-tickets" },
      { text: "Tranquility", path: "/tranquility" },
      
    ],
    vorAmePlans: [
      { text: "Plans", path: "/plans" },
      { text: "Discounted Plans", path: "/promotions" },
      { text: "Discounted Promos", path: "/promos" },
    ],
    payments: [
      { text: "Plans", path: "/plans" },
    ],
  };

  const isSelected = (path) => location.pathname === path;
  const isPaymentsSelected = location.pathname.startsWith("/plans");

  return (
    <Box
      width={1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    
    >
      <Box
        component="img"
        height="54px"
        width="55px"
        className="cursor-pointer"
        onClick={() => navigate("/")}
        src="/logos/Logo.png"
        alt="Logo"
        
      />

      <Box
        justifyContent="center"
        sx={{ display: "flex", gap: 3, flexGrow: 1 }}
      >
        <Box
          display="flex"
          className="cursor-pointer"
          onClick={() => handleNavigation("/")}
          gap="16px"
          alignItems="center"
        >
          <ListItemText
            primary="Dashboard"
            sx={{
              fontWeight: isSelected("/") ? 600 : 500,
              color: isSelected("/") ? "#222222" : "#181D25",
              bgcolor: isSelected("/") ? "#F5F5F5" : "transparent",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          />
        </Box>

        <Box>
          <Box
            display="flex"
            className="cursor-pointer"
            onClick={(e) => handleMenuOpen("contentManager", e)}
            gap="16px"
            alignItems="center"
          >
            <ListItemText primary="Manage Content" 
            sx={{
              fontWeight: isSelected("") ? 700 : 500,
              color: isSelected("") ? "#222222" : "#181D25",
              bgcolor: isSelected("") ? "#F5F5F5" : "transparent",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
            />
          </Box>
          {currentMenu === "contentManager" && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              disableScrollLock
              slotProps={{
                paper: {
                  sx: { maxWidth: "180px", width: "100%" },
                },
              }}
            >
              {menuItems.contentManager.map((item) => (
                <MenuItem
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    fontWeight: isSelected(item.path) ? 600 : 400,
                    color: isSelected(item.path) ? "#222222" : "#181D25",
                    bgcolor: isSelected(item.path) ? "#F5F5F5" : "transparent",
                  }}
                >
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
            </Menu>
          )}
        </Box>

        <Box
          display="flex"
          className="cursor-pointer"
          onClick={() => handleNavigation("/user/list")}
          gap="16px"
          alignItems="center"
        >
          <ListItemText
            primary="Manage Users"
            sx={{
              fontWeight: isSelected("/user/list") ? 700 : 500,
              color: isSelected("/user/list") ? "#222222" : "#181D25",
              bgcolor: isSelected("/user/list") ? "#F5F5F5" : "transparent",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          />
        </Box>

        <Box
          display="flex"
          className="cursor-pointer"
          onClick={() => handleNavigation("/plans")}
          gap="16px"
          alignItems="center"
          sx={{
            bgcolor: isPaymentsSelected ? '#F5F5F5' : 'transparent',
            borderRadius: 1,
            '&:hover': {
              bgcolor: '#F5F5F5',
            },
          }}
        >
          <ListItemText primary="Payments" 
            sx={{
              fontWeight: isPaymentsSelected ? 600 : 500,
              color: isPaymentsSelected ? "#222222" : "inherit",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          />
        </Box>

        <Box
          display="flex"
          className="cursor-pointer"
          onClick={() => handleNavigation("/faqs")}
          gap="16px"
          alignItems="center"
        >
          <ListItemText
            primary="FAQs"
            sx={{
              fontWeight: isSelected("/faqs") ? 700 : 400,
              color: isSelected("/faqs") ? "#222222" : "inherit",
              bgcolor: isSelected("/faqs") ? "#F5F5F5" : "transparent",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TopNav;
