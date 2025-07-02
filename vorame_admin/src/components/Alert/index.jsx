import React from "react";
import { Alert } from "@mui/material";
import { StyledAlertBox } from "./style";

const CommonAlert = ({ isOpen, setIsOpen, severity, message }) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {isOpen && (
        <StyledAlertBox>
          <Alert severity={severity} onClose={handleClose}>
            {message}
          </Alert>
        </StyledAlertBox>
      )}
    </div>
  );
};

export default CommonAlert;
