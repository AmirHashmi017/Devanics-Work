import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CreatePromo from "../../promos/components/CreatePromo";
import CustomButton from "components/Button";
import CustomDialog from "components/Modal";

const AddPromotion = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <CustomDialog title="Create new promotion" open={open} onClose={() => setOpen(false)}>
        <CreatePromo setOpen={setOpen} />
      </CustomDialog>

      <CustomButton
        onClick={() => setOpen(true)}
        sx={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: "24px",
          letterSpacing: "0%",
          paddingY: "10px",
          paddingX: "18px",
        }}
      >
        Create new promotions
      </CustomButton>
    </div>
  );
};

export default AddPromotion;
