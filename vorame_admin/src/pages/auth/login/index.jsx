import React, { useState } from "react";
import {
  Grid,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { loginValidationSchema } from "../../../utils/validation";
import { loginInitialValues } from "../../../constants";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";
import { CustomButton, CustomTextField } from "../../../components";

import { StyledBox, StyledGrid, StyledLink } from "./style";

const SignIn = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { login } = useAuth();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const { mutate: signinUser, isLoading } = useMutation((body) => login(body), {
    onSuccess: (res) => {
      if (res?.response?.statusCode === 200) {
        toast.success("Login successfully");
        navigate("/");
        formik.resetForm();
      } else {
        toast.error(res.response.message);
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = (values) => {
    signinUser({ ...values, keepLoggedIn });
  };

  const handleKeepLoggedInChange = (event) => {
    setKeepLoggedIn(event.target.checked);
  };

  // Handle navigate forgot password
  const forgotNavigate = () => {
    navigate("/forgot-password");
  };
  return (
    <>
      <StyledGrid container justifyContent="center" alignItems="center">
        <StyledBox>
          <Typography
            sx={{
              marginTop: "35px",
              marginLeft: "40px",
              fontFamily: "Work Sans",
              fontWeight: 600,
              fontSize: "24px",
              lineHeight: "34px",
              letterSpacing: "0px",
              color: theme.palette.common.dark,
            }}
            gutterBottom
          >
            Vor Amé
          </Typography>
        </StyledBox>
        <Grid item sx={{ width: "370px" }}>
          <form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Typography
              align="center"
              gutterBottom
              color={theme.palette.common.dark}
              marginBottom={8}
              sx={{
                fontFamily: "Work Sans",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "34px",
                letterSpacing: "0px",
              }}
            >
              Log into Vor Amé
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <CustomTextField
                  name="email"
                  label="Email address"
                  type="email"
                  value={formik.values.email}
                  variant="standard"
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputLabelProps={{
                    sx: {
                      color: "#84818A",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <CustomTextField
                  name="password"
                  label="Password"
                  type="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  variant="standard"
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                  InputLabelProps={{
                    sx: {
                      color: "#84818A",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={keepLoggedIn}
                      onChange={handleKeepLoggedInChange}
                      color="primary"
                    />
                  }
                  sx={{ color: theme.palette.grey[500] }}
                  label="keep me signed in"
                />
              </Grid>
              {/* Login Button */}
              <Grid item xs={12}>
                <CustomButton type="submit" loading={isLoading} fullWidth sx={{
                     fontFamily: "Work Sans",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "34px",
              letterSpacing: "0px",
                }}>
                  Log in
                </CustomButton>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
                my: 5,
              }}
            >
              <StyledLink variant="subtitle1" onClick={forgotNavigate} sx={{
                   fontFamily: "Work Sans",
              fontWeight: 500,
              fontSize: "14px",
       
              }}>
                Can't log in?
              </StyledLink>
            </Grid>
          </form>
        </Grid>
        {/* <Grid
          container
          justifyContent="center"
          alignItems="center"
          direction="column"
          sx={{ position: "absolute", bottom: 10, width: "100%" }}
        >
          <Typography
            variant="body1"
            color={theme.palette.common.dark}
            align="center"
          >
            Secure login with reCAPTCHA subject to Google
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.common.dark}
            align="center"
          >
            <Link>Terms</Link> & <Link>Privacy</Link>
          </Typography>
        </Grid> */}
      </StyledGrid>
    </>
  );
};

export default SignIn;
