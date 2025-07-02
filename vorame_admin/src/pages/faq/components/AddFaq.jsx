import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CreatePlan from "./CreateFaq";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";
import { Add } from "@mui/icons-material";

const AddPlan = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog title="Add FAQ" open={open} onClose={() => setOpen(false)}>
        <CreatePlan setOpen={setOpen} />
      </CustomDialog>
      <Box display="flex" justifyContent="space-between" gap={2} mt={4}>
        <Typography sx={{fontSize:"24px"}} fontWeight={600}>FAQs</Typography>
        <CustomButton onClick={() => setOpen(true)} startIcon={<Add />}>
          Add
        </CustomButton>
      </Box>
    </div>
  );
};

export default AddPlan;
