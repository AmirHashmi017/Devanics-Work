import React from 'react'
import { Box, MenuItem, Select } from "@mui/material";
import ErrorMsg from 'components/ErrorMsg';
import { ErrorMessage, useField } from 'formik';

const CustomSelect = (props) => {

    const {
        label = '',
        id = '',
        name = '',
        variant = "outlined",
        size = "small",
        labelStyle,
        inputStyle,
        options = [],
        fullWidth = true,
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
            <Box mt="6px">
                <Select
                    id={id}
                    name={name}
                    size={size}
                    error={hasError}
                    fullWidth={fullWidth}
                    {...field}
                    {...rest}
                >
                    {
                        options.map(({ label, value }) => (
                            <MenuItem value={value}>{label}</MenuItem>
                        ))
                    }
                </Select>
            </Box>
            {showErrorMsg && <ErrorMessage name={name} component={ErrorMsg} />}
        </Box>
    )
}

export default CustomSelect