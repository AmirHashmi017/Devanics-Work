import { Box, TextField } from "@mui/material";
import ErrorMsg from "components/ErrorMsg";
import { ErrorMessage, useField } from "formik";

const CustomInput = (props) => {
  const {
    label = '',
    id = '',
    name = '',
    size = 'small',
    variant = "outlined",
    labelStyle,
    fullWidth = true,
    inputStyle,
    showErrorMsg = true,
    ...rest
  } = props;

  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <Box>
      {
        label && (
          <Box
            component="label"
            htmlFor={name}
            id={id || name}
            fontSize="14px"
            fontWeight="500"
          >
            {label}
          </Box>
        )
      }
      <Box mt='6px'>
        <TextField
          error={hasError}
          size={size}
          fullWidth={fullWidth}
          id={id || name}
          variant={variant}
          {...field}
          {...rest}
        />
      </Box>
      {showErrorMsg && <ErrorMessage name={name} component={ErrorMsg} />}
    </Box>
  );
};

export default CustomInput;
