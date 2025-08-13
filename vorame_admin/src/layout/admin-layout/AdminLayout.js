import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { Topbar, Sidebar } from "./components";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import api from "utils/axios";
import { toast } from "react-toastify";

const drawerWidth = 260;

function AdminLayout(props) {
  const { window } = props;
  const navigate = useNavigate();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  useEffect(() => {
    api.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.log(error, "err....");
        if (error.response.status === 401) {
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar elevation={0} sx={{ p: 0, zIndex: 1200 }} position="fixed">
        <Topbar handleDrawerToggle={handleDrawerToggle} />
      </AppBar>
      <Box
        component="nav"
        // sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        // aria-label="mailbox folders"
      >
        {/* <Drawer
          container={
            window !== undefined ? () => window().document.body : undefined
          }
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
            border: "none",
          }}
        >
          {/* <Sidebar handleDrawerToggle={handleDrawerToggle} /> */}
        {/* </Drawer>  */}
        {/* <Drawer
          variant="permanent"
          PaperProps={{ style: { border: "none" } }}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          <Sidebar />
        </Drawer> */}
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: 1,
          maxWidth: 1400,
          mx: "auto",
          // background: theme.palette.grey[200],
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

AdminLayout.propTypes = {
  window: PropTypes.func,
};

export default AdminLayout;
