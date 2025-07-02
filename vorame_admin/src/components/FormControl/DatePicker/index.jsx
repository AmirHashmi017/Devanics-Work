import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { StyledLabel } from "./style";
import { ErrorMessage, Field } from "formik";
import { Box } from "@mui/material";
import ErrorMsg from "components/ErrorMsg";

const CustomDatePicker = ({
  label = "",
  name = '',
  id = '',
  placeholder = 'dd/mm/yyyy',
  variant = "outlined",
  size = "small",
  value = null,
  showErrorMsg = true,
  ...rest
}) => {

  return (
    <Box width={1}>
      <StyledLabel htmlFor={name} id={id || name}>{label}</StyledLabel>
      <Field name="lastName">
        {({
          field,
          form: { setFieldValue },
          meta,
        }) => {
          const hasError = meta.touched && meta.error;
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={value ? dayjs(value) : null}
                {...field}
                onChange={(value) => setFieldValue(name, value)}
                slotProps={{
                  textField: {
                    name,
                    size,
                    variant,
                    fullWidth: true,
                    placeholder: "dd/mm/yyyy",
                    InputProps: {
                      sx: { borderRadius: 1, mt: 1 },
                      error: hasError
                    },
                  },
                }}
                {...rest}
              />
            </LocalizationProvider>
          )
        }}
      </Field>
      {showErrorMsg && <ErrorMessage name={name} component={ErrorMsg} />}
    </Box>
  );
};

export default CustomDatePicker;
