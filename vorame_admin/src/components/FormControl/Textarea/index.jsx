import { Box, TextField } from "@mui/material";
import ErrorMsg from "components/ErrorMsg";
import { ErrorMessage, useField } from "formik";

const Textarea = (props) => {
  const {
    label,
    id,
    name,
    rows = 4,
    variant = "outlined",
    labelStyle,
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
            id={id}
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
          name={name}
          multiline
          fullWidth
          id={id || name}
          variant={variant}
          rows={rows}
          {...field}
          {...rest}
        />
        {showErrorMsg && <ErrorMessage name={name} component={ErrorMsg} />}
      </Box>
    </Box>
  );
};

export default Textarea;
