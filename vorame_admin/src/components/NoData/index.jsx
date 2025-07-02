import React from "react";
import { Box, Typography } from "@mui/material";

const NoData = ({ message = "No Data Available" }) => {
  return (
    <Box
      my={1.5}
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={1}
    >
      <Typography variant="subtitle1" textAlign='center' width={1}>
        {message}
      </Typography>
    </Box>
  );
};

export default NoData;
