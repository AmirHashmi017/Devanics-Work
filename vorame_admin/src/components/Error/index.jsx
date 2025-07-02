import { Box, Typography } from "@mui/material";
import React from "react";

const Error = ({ error }) => {
  const { message = 'Something went wrong' } = error || {};
  return <Box
    my={1.5}
    display="flex"
    justifyContent="center"
    alignItems="center"
    width={1}
  >
    <Typography variant="subtitle1" textAlign='center' width={1}>
      {message}
    </Typography>
  </Box>;
};

export default Error;
