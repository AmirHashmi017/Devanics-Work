import React, { useState } from "react";
import { Box, Paper, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import Jobs from "./index";
import AddJob from "./components/AddJob";
const Careers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <Box mt={3}>
      <AddJob />
      <Jobs searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </Box>
  );
};

export default Careers;
