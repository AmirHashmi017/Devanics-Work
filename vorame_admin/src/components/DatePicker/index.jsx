import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { Grid } from "@mui/material";

import { StyledLabel } from "./style";

const CustomDatePicker = ({
  name,
  label = "Date",
  value,
  onChange,
  onBlur,
  error,
  helperText,
  variant = "outlined",
  size = "small",
  ...rest
}) => {
  const handleDateChange = (newValue) => {
    onChange({ target: { name, value: newValue } });
  };

  return (
    <Grid>
      <StyledLabel htmlFor="date">{label}</StyledLabel>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          // label={label}
          value={value ? dayjs(value) : null}
          onChange={handleDateChange}
          onBlur={onBlur}
          format="DD/MM/YYYY"
          slotProps={{
            textField: {
              name,
              size,
              variant,
              error,
              helperText,
              fullWidth: true,
              placeholder: "dd/mm/yyyy",
              InputProps: {
                sx: { borderRadius: 2.5, mt: 1 },
              },
            },
          }}
          {...rest}
          sx={{ width: "100%", borderRadius: 1 }}
        />
      </LocalizationProvider>
    </Grid>
  );
};

export default CustomDatePicker;
