import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { FilterList, Search as SearchIcon } from "@mui/icons-material";
import PromoModule from "./promos/index";
import Plans from "./plan/index";
import Promotions from "./promotion/index";
import AddPromotion from "./promotion/components/AddPromotion";
import AddPlan from "./plan/components/AddPlan";

const tabOptions = ["Plan", "Promotions"];

const PlansTab = ({ searchTerm, setSearchTerm }) => {
  const [, setOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Plans />;
      case 1:
        return <Promotions />;
      default:
        return null;
    }
  };

  return (
    <Box mt={4}>
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
      {selectedTab === 0 ? <AddPlan /> : <AddPromotion />}
      </Box>
      <Box mt={3}>{renderTabContent()}</Box>
    </Box>
  );
};

export default PlansTab;
