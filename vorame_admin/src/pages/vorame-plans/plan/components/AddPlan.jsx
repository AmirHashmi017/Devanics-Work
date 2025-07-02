import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CreatePlan from "./CreatePlan";
import { CustomButton } from "components";
import CustomDialog from "components/Modal";

const AddPlan = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog title="Add Plan" open={open} onClose={() => setOpen(false)}>
        <CreatePlan setOpen={setOpen} />
      </CustomDialog>

      <CustomButton
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0%",
          paddingY: "10px",
          paddingX: "18px",
        }}
        onClick={() => setOpen(true)}
      >
        Create New Plan
      </CustomButton>
    </div>
  );
};

export default AddPlan;
