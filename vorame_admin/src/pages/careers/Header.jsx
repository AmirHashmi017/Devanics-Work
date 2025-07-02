import React from "react";
import { Box } from "@mui/material";
import Jobs from "./index";
import AddJob from "./components/AddJob";
const Careers = () => {
  return (
    <Box mt={6}>
      <AddJob />
      <Jobs />
    </Box>
  );
};

export default Careers;
