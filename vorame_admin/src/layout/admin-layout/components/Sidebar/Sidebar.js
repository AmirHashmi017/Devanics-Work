import React from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import SidebarItem from "./SibeBarItem";

import { StyledList, StyledBox } from "./style";

const Sidebar = ({ handleDrawerToggle, children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openState, setOpenState] = React.useState({});

  const handleToggle = (key) => {
    setOpenState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (handleDrawerToggle) {
      handleDrawerToggle();
    }
  };

  return (
    <Box width={1} display='flex' justifyContent='space-between' >
      <Box component='img' height='54px' width='55px' className="cursor-pointer" onClick={() => navigate('/')} src="/logos/Logo.png" alt="Logo" />
      <StyledList component="nav" width={1} aria-labelledby="nested-list-subheader" p={0}>
        <SidebarItem
          icon="/icons/home-smile.svg"
          iconActive="/icons/home-smile.svg"
          iconHover="/icons/home-smile.svg"
          text="Dashboard"
          path="/dashboard"
          onClick={() => handleNavigation("/")}
          isActive={location.pathname === "/"}
        />
        <SidebarItem
          icon="/icons/container.svg"
          text="Manager Content"
          // nestedItems={[
          //   {
          //     text: "After the Whistle",
          //     path: "/whistle",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "Blogs",
          //     path: "/blogs",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "BookClub",
          //     path: "/bookclub",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "Clips",
          //     path: "/clips",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "A-Z",
          //     path: "/library",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "BluePrint",
          //     path: "/blueprint",
          //     onClick: handleNavigation,
          //   },
          // ]}
          nestedOpen={openState.contentManagerOpen}
          onClick={() => handleToggle("contentManagerOpen")}
          isActive={location.pathname.startsWith("/content-manager")}
        />
        {/* <SidebarItem
          icon="/icons/diamond-01.svg"
          text="Paid Content"
          nestedItems={[
            {
              text: "Lounge",
              path: "/lounge",
              onClick: handleNavigation,
            },
            {
              text: "Tape",
              path: "/tape",
              onClick: handleNavigation,
            },
            {
              text: "Practice",
              path: "/practice",
              onClick: handleNavigation,
            },
          ]}
          nestedOpen={openState.paidContentOpen}
          onClick={() => handleToggle("paidContentOpen")}
          isActive={location.pathname.startsWith("/paid-content")}
        /> */}
        <SidebarItem
          icon="/icons/users.svg"
          text="Manage User"
          iconActive="/icons/users.svg"
          iconHover="/icons/users.svg"
          // nestedItems={[
          //   {
          //     text: "User List",
          //     path: "/user/list",
          //     onClick: () => handleNavigation("/user/list")
          //   },
          //   {
          //     text: "Add User",
          //     path: "/user/add",
          //     onClick: handleNavigation,
          //   },

          //   {
          //     text: "Reports",
          //     path: "/user/reports",
          //     onClick: handleNavigation,
          //   },
          // ]}
          nestedOpen={openState.userManagerOpen}
          onClick={() => handleToggle("userManagerOpen")}
          isActive={location.pathname.startsWith("/user")}
        />
        <SidebarItem
          icon="/icons/diamond-01.svg"
          text="Payments"
          // nestedItems={[
          //   {
          //     text: "Lounge",
          //     path: "/lounge",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "Tape",
          //     path: "/tape",
          //     onClick: handleNavigation,
          //   },
          //   {
          //     text: "Practice",
          //     path: "/practice",
          //     onClick: handleNavigation,
          //   },
          // ]}
          nestedOpen={openState.paidContentOpen}
          onClick={() => handleToggle("paidContentOpen")}
          isActive={location.pathname.startsWith("/paid-content")}
        />
        {/* Faqs */}
        <SidebarItem
          icon="/icons/diamond-01.svg"
          text="Vor Ame Plans"
          iconActive="/icons/diamond-01.svg"
          iconHover="/icons/diamond-01.svg"
          nestedItems={[
            {
              text: "Plans",
              path: "/plans",
              onClick: handleNavigation,
            },
            {
              text: "Discounted Plans",
              path: "/promotions",
              onClick: handleNavigation,
            },
            {
              text: "Discounted Promos",
              path: "/promos",
              onClick: handleNavigation,
            },
          ]}
          nestedOpen={openState.verome}
          onClick={() => handleToggle("verome")}
          isActive={location.pathname.startsWith("/users")}
        /> 
         <SidebarItem
          icon="/icons/briefcase-dark.svg"
          iconActive="/icons/briefcase-dark.svg"
          iconHover="/icons/briefcase-dark.svg"
          text="Careers"
          path="/careers"
          onClick={() => handleNavigation("/careers")}
          isActive={location.pathname === "/careers"}
        /> 
         <SidebarItem
          icon="/icons/calendar.svg"
          iconActive="/icons/calendar.svg"
          iconHover="/icons/calendar.svg"
          text="Sessions"
          path="/sessions"
          onClick={() => handleNavigation("/events")}
          isActive={location.pathname === "/events"}
        />
        <SidebarItem
          icon="/icons/briefcase-dark.svg"
          iconActive="/icons/briefcase-dark.svg"
          iconHover="/icons/briefcase-dark.svg"
          text="Support"
          path="/support-tickets"
          onClick={() => handleNavigation("/support-tickets")}
          isActive={location.pathname === "/support-tickets"}
        />
        <SidebarItem
          icon="/icons/help.svg"
          iconActive="/icons/help-active.svg"
          iconHover="/icons/help-active.svg"
          text="FQAs"
          path="/faqs"
          onClick={() => handleNavigation("/faqs")}
          isActive={location.pathname === "/faq"}
        />
      </StyledList>
      <Box>
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
