// LinearProgressWithLabel.js
import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ mb: 1 }}>File is uploading</Typography>{" "}
      <LinearProgress variant="determinate" {...props} />
      <Typography
        variant="body2"
        color="text.secondary"
        align="right"
        sx={{ mt: 1 }}
      >
        {`${Math.round(props.value)}%`}
      </Typography>{" "}
    </Box>
  );
};

export default LinearProgressWithLabel;
