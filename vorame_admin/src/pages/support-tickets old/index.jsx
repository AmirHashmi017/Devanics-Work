import React, { useState } from "react";
import DateFilters from "./components/DateFilters";
import { Typography } from "@mui/material";
import SupportTicketTabs from "./components/Tabs";

const SupportTicketModule = () => {

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div>
      <DateFilters startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
      <Typography variant="body1" fontWeight={600} fontSize={24}>
        Support
      </Typography>
      <SupportTicketTabs startDate={startDate} endDate={endDate} />
    </div>
  );
};

export default SupportTicketModule;
