import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const CustomTextField = ({
  name,
  label,
  type,
  value,
  onChange,
  error,
  helperText,
  variant,
  size = "small",
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TextField
    sx={{borderRadius:"8px !important"}}
      name={name}
      label={label}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth
      size={size}
      variant={variant}
      InputProps={
        type === "password"
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : undefined
      }
      {...rest}
    />
  );
};

export default CustomTextField;
