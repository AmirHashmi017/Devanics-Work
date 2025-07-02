import React from "react";
import { Grid, TextField, CardContent, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { resetPasswordValidationSchema } from "../../../utils/validation";
import { resetPasswordInitialValues } from "../../../constants";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { CustomButton } from "../../../components";
import AuthApi from "../../../services/api/auth";

import { StyledBox, StyledGrid, StyledTypographyButton } from "./styles";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const { mutate: resetPassword, isLoading } = useMutation(
    (body) => AuthApi.resetPassword(body),
    {
      onSuccess: (res) => {
        if (res?.statusCode === 200) {
          toast.success(res?.message);
          navigate("/login");
        } else {
          toast.error(res?.message);
        }
      },
      onError: (error) => toast.error(error.message),
    },
  );

  const formik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = (values) => {
    resetPassword({ ...values, userId: id });
  };

  return (
    <>
      <StyledGrid container justifyContent="center" alignItems="center">
        <StyledBox>
          <Typography
            variant="h4"
            sx={{ color: theme.palette.common.dark }}
            gutterBottom
          >
            Vor Amé
          </Typography>
          <StyledTypographyButton
            variant="body1"
            gutterBottom
            onClick={() => {
              navigate("/login");
            }}
          >
            LOG IN
          </StyledTypographyButton>
        </StyledBox>

        <Grid item xs={12} md={4} sx={{ padding: theme.spacing(5) }}>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <CardContent>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                color={theme.palette.common.dark}
              >
                Set New Password
              </Typography>
              <Grid
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  mb: 5,
                }}
              ></Grid>
              <Grid container spacing={2}>
                {/* Password */}
                <Grid item xs={12}>
                  <TextField
                    name="password"
                    label="Reset password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    fullWidth
                    size="small"
                    variant="standard"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {/* Confirm password */}
                <Grid item xs={12}>
                  <TextField
                    name="confirmPassword"
                    label="Re-type password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    fullWidth
                    size="small"
                    variant="standard"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                {/* Confirm Button */}
                <Grid item xs={12}>
                  <CustomButton type="submit" loading={isLoading} fullWidth>
                    Confirm
                  </CustomButton>
                </Grid>
              </Grid>
            </CardContent>
          </form>
        </Grid>
      </StyledGrid>
    </>
  );
};

export default ResetPassword;
