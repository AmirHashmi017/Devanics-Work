import React, { useState } from "react";
import { Box, Typography, Paper, InputBase, IconButton } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import PromotionTable from "./index";
import AddPromotion from "./components/AddPromotion";

const Promotions = ({}) => {
  return (
    <Box mt={4}>
      <AddPromotion/>
      <PromotionTable />
    </Box>
  );
};

export default Promotions;
