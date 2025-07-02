import React from "react";
import PropTypes from "prop-types";
import { Button, CircularProgress } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme, children }) => ({
  backgroundColor:
    children === "Cancel"
      ? theme.palette.common.white
      : theme.palette.common.dark,
  color:
    children === "Cancel" ? theme.palette.common.dark : theme.palette.grey[0],
  textTransform: "none",
  letterSpacing: 1,
  border: children === "Cancel" ? `1px solid ${theme.palette.grey[400]}` : "none", 
  borderRadius: children === "Cancel" ? "8px" : "8px",
  padding: "5px 15px",

      // 👇 Reduce gap between icon and text
  '& .MuiButton-startIcon': {
    marginRight: 4, // default is 8px
  },
  '& .MuiButton-endIcon': {
    marginLeft: 4, // in case you're using loading spinner as endIcon
  },
  


  "&:hover": {
    backgroundColor:
      children === "Cancel"
        ? theme.palette.common.white
        : theme.palette.common.dark,
  },
}));

const CustomButton = ({
  children,
  loading,
  fullWidth,
  startIcon,
  ...props
}) => {
  return (
    <StyledButton
      fullWidth={fullWidth}
      size={fullWidth ? "large" : "small"}
      startIcon={startIcon}
      endIcon={loading && <CircularProgress size={15} color="inherit" />}
      // variant="contained"
      {...props}
    >
      {children}
    </StyledButton>
  );
};

CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  startIcon: PropTypes.node,
  sx: PropTypes.object,
};

export default CustomButton;
