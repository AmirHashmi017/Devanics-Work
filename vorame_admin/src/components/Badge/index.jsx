import React from "react";

import { StyledBadge } from "./style";
import { Box } from "@mui/material";

const CustomBadge = ({ badgeContent, onClick }) => {
  return (
    <Box onClick={onClick}>
      <StyledBadge badgeContent={badgeContent}></StyledBadge>
    </Box>
  );
};

export default CustomBadge;
