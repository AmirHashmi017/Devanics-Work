import { Typography } from "@mui/material";
import React from "react";

const ErrorMsg = (props) => {
  const { error, children } = props;

  return (
    <Typography my={0.5} color="red" variant="body2">
      {children || error}
    </Typography>
  );
};

export default ErrorMsg;
