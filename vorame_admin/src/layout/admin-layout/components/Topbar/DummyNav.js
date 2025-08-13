import React, { useState } from "react";
import { AppBar, Toolbar, Button, Menu, MenuItem, Typography, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import DiamondIcon from "@mui/icons-material/Diamond";
import HelpIcon from "@mui/icons-material/Help";

const DummyNav = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [menu, setMenu] = useState(null);

    const handleMenuOpen = (event, menuName) => {
        setAnchorEl(event.currentTarget);
        setMenu(menuName);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenu(null);
    };

    return (
        <AppBar position="static" color="inherit" elevation={0} >
            <Toolbar>
                <IconButton edge="start" color="inherit">
                    <HomeIcon />
                </IconButton>
                <Typography variant="h6" sx={{ ml: 1 }}>
                    Dashboard
                </Typography>

                {/* Manager Content Dropdown */}
                <Button
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, "managerContent")}
                    endIcon={<span>▾</span>}
                >
                    Manager Content
                </Button>
                <Menu
                    anchorEl={menu === "managerContent" ? anchorEl : null}
                    open={menu === "managerContent"}
                    onClose={handleMenuClose}
                    disableScrollLock
                >
                    <MenuItem onClick={handleMenuClose}>Content 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Content 2</MenuItem>
                </Menu>

                {/* Manage User Dropdown */}
                <Button
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, "manageUser")}
                    endIcon={<span>▾</span>}
                >
                    Manage User
                </Button>
                <Menu
                    anchorEl={menu === "manageUser" ? anchorEl : null}
                    open={menu === "manageUser"}
                    onClose={handleMenuClose}
                    disableScrollLock
                >
                    <MenuItem onClick={handleMenuClose}>User 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>User 2</MenuItem>
                </Menu>

                {/* Payments Dropdown */}
                <Button
                    color="inherit"
                    onClick={(event) => handleMenuOpen(event, "payments")}
                    endIcon={<span>▾</span>}
                >
                    Payments
                </Button>
                <Menu
                    anchorEl={menu === "payments" ? anchorEl : null}
                    open={menu === "payments"}
                    onClose={handleMenuClose}
                    disableScrollLock
                >
                    <MenuItem onClick={handleMenuClose}>Payment 1</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Payment 2</MenuItem>
                </Menu>

                {/* FAQs */}
                <Button color="inherit" startIcon={<HelpIcon />}>
                    FAQs
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default DummyNav;
