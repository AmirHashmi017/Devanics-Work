import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CreateEvent from "./CreateEvent";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";
import { Add } from "@mui/icons-material";

const AddEvent = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog
        title="Create Event"
        open={open}
        onClose={() => setOpen(false)}
      >
        <CreateEvent setOpen={setOpen} />
      </CustomDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Events
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="stretch"
          gap={2}
        >
          <CustomButton
            sx={{ p: 1, borderRadius: "8px" }}
            startIcon={<Add />}
            onClick={() => setOpen(true)}
          >
            Add Event
          </CustomButton>
        </Box>
      </Box>
    </div>
  );
};

export default AddEvent;
