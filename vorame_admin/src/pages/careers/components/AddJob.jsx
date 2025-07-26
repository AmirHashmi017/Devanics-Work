import React, { useState } from "react";
import CreateJob from "./CreateJob";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";
import { Add } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const AddJob = ({ searchTerm, setSearchTerm }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog
        title="Add New Job"
        open={open}
        onClose={() => setOpen(false)}
      >
        <CreateJob setOpen={setOpen} />
      </CustomDialog>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="body1" fontWeight={600} fontSize={24}>
          Careers
        </Typography>
        <CustomButton sx={{ p: 1, borderRadius: '8px' }} startIcon={<Add />} onClick={() => setOpen(true)}>
          Create New Job
        </CustomButton>
      </Box>
    </div>
  );
};

export default AddJob;
