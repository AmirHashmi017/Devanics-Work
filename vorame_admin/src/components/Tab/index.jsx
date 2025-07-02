import React from "react";
import { Box } from "@mui/material";
import TabContext from "@mui/lab/TabContext";

import { StyledTab, StyledTabList } from "./style";

const MyTabsComponent = ({ tabOptions, tabValue, handleChange }) => {
  return (
    <Box sx={{ width: "100%", }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
          <StyledTabList
            onChange={handleChange}
            aria-label="Library A-Z Tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabOptions.map((letter) => (
              <StyledTab key={letter} label={letter} value={letter} sx={{fontSize:"16px", fontWeight:500, }}/>
            ))}
          </StyledTabList>
        </Box>
      </TabContext>
    </Box>
  );
};

export default MyTabsComponent;
