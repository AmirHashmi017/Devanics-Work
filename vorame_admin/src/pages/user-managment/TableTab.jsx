import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Button,
} from "@mui/material";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import ExpiredPlan from "./expired-plan/index";
import CancelledPaidPlan from "./cancelled-paid-plan/index";
import BlockedUser from "./blocked-user/index";
import AllUsers from "./all-user/index";

const tabOptions = [
  "All Users",
  "Expired Plan",
  "Cancelled paid plan",
  "Blocked Users",
];

const TableTab = ({ searchTerm, setSearchTerm }) => {
  const [, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <AllUsers searchTerm={searchTerm} />;
      case 1:
        return <ExpiredPlan searchTerm={searchTerm} />;
      case 2:
        return <CancelledPaidPlan searchTerm={searchTerm} />;
      case 3:
        return <BlockedUser searchTerm={searchTerm} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      <Box>
        <Typography variant="h6" sx={{fontSize:"24px"}} fontWeight={600} mb={3}>
          User Management
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={selectedTab}
          onChange={(_, newValue) => setSelectedTab(newValue)}
          textColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          {tabOptions.map((label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                textTransform: "none",
                fontWeight: selectedTab === index ? 600 : 400,
                fontSize: "16px",
                color: selectedTab === index ? "#000 !important" : "#6c757d",
                backgroundColor:
                  selectedTab === index ? "#F5F5F5" : "transparent",
                borderRadius: "8px",
                minHeight: 40,
                px: 2,
                mr: 1,
              }}
            />
          ))}
        </Tabs>

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

      <Box mt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

export default TableTab;
