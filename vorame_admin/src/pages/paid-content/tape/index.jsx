import React, { useState } from "react";
import Headbar from "./components/Headbar";
import { Box } from "@mui/material";
import Tapes from "./components/Tapes";

const Tape = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return <Box>
    <Headbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    <Tapes searchTerm={searchTerm} />
  </Box>;
};

export default Tape;
