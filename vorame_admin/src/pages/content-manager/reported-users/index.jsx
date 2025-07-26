import React, { useEffect, useState } from "react";
import { Box, IconButton, Pagination, Typography, Tabs, Tab, Paper, InputBase } from "@mui/material";
import { ArrowBack, ArrowForward, Search as SearchIcon } from "@mui/icons-material";
import UserManagementTable from "./boardroom/Table";
import TouchpadTable from "./touchpad/Table";

const tabOptions = ["Boardroom", "Touchpad"];

const ReportedUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [limit] = useState(9);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState(0); // 0: Boardroom, 1: Touchpad

  useEffect(() => {
    setPage(1);
  }, [searchTerm, tab]);

  return (
    <Box>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: '24px', fontWeight: 600, ml: 0 }}>Reported Users</Typography>
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
            onSubmit={e => e.preventDefault()}
          >
            <IconButton type="button" sx={{ p: 0.5 }}>
              <SearchIcon fontSize="small" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "14px" }}
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              inputProps={{ "aria-label": "search users" }}
            />
          </Paper>
        </Box>
      </Box>
      <Box mt={3}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{ mb: 2 }}
        >
          {tabOptions.map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: tab === index ? 600 : 400,
                fontSize: "16px",
                color: tab === index ? "#000 !important" : "#6c757d",
                backgroundColor: tab === index ? "#F5F5F5" : "transparent",
                borderRadius: "8px",
                minHeight: 40,
                px: 2,
                mr: 1,
              }}
            />
          ))}
        </Tabs>
        {tab === 0 ? (
          <UserManagementTable
            searchTerm={searchTerm}
            limit={limit}
          />
        ) : (
          <TouchpadTable
            searchTerm={searchTerm}
            limit={limit}
          />
        )}
      </Box>
    </Box>
  );
};

export default ReportedUsers;
