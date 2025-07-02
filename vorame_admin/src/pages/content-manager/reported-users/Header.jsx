import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ReportedUsers from "./index";

const Header = ({ searchTerm, setSearchTerm }) => {

  return (
    <Box mt={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" >
        <Box >
        <Typography variant="h6" fontWeight={600} >
          Reported Users
        </Typography>

        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Paper
            component="form"
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: 280,
              borderRadius: "8px",
              height: "40px !important",
              backgroundColor: "#F4F5F6",
              boxShadow: "none",
            }}
          >
            <IconButton type="button" sx={{ p: 0.5 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search users" }}
            />
          </Paper>
        </Box>
      </Box>
      <Box>
        <ReportedUsers />
      </Box>
    </Box>
  );
};

export default Header;
