import React, { useState } from "react";
import { Grid, CardContent, Typography, Link } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { forgotValidationSchema } from "../../../utils/validation";
import { forgotInitialValues } from "../../../constants";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { CustomButton } from "../../../components";
import AuthApi from "../../../services/api/auth";
import { CustomTextField, CustomAlert } from "../../../components";
import { grey } from '@mui/material/colors';


import {
  StyledBox,
  StyledGrid,
  StyledTypographyButton,
  StyledTypography,
  StyledLink,
  StyledForgotEmail,
  StyledLinkGrid,
  CardGrid,
  TitleGrid,
} from "./style";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [isMailSent, setIsMailSent] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { mutate: forgotPassword, isLoading } = useMutation(
    (body) => AuthApi.forgotPassword(body),
    {
      onSuccess: (res) => {
        if (res?.statusCode === 200) {
          setIsMailSent(true);
          toast.success(res?.message);
        } else {
          toast.error(res?.message);
        }
      },
      onError: (error) => toast.error(error.message),
    },
  );

  const formik = useFormik({
    initialValues: forgotInitialValues,
    validationSchema: forgotValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const handleSubmit = (values) => {
    forgotPassword({ ...values, appType: "web" });
  };

  // Handle continue
  const handleContinue = async () => {
    setIsAlertOpen(true);
  };

  // Resend link
  const handleResendLink = async (linkFor) => {
    try {
      if (isMailSent) {
        const body = { email: formik.values.email };
        const response = await AuthApi.forgotPassword(body);
        if (response?.statusCode === 200) {
          if (linkFor === "resend") {
            toast.success("Reset password link resend successfully");
          } else {
            toast.success("Password reset link send successfully");
          }
        } else {
          toast.error(response?.message);
        }
      }
    } catch (error) {
      toast.error(error?.response?.message);
    }
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

        {!isMailSent ? (
          <Grid item xs={12} md={4} sx={{ padding: theme.spacing(5) }}>
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
              <CardContent>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  color={theme.palette.common.dark}
                >
                  Forgot password?
                </Typography>
                <Grid
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    justifyContent: "center",
                    mb: 5,
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.common.dark, color: grey[800] }}
                  >
                    No worries! just enter your email and we'll send <br /> you
                    a reset password link
                  </Typography>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} >
                    <CustomTextField
                      variant="standard"
                      name="email"
                      label="Email address"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                      sx={{
                        color: grey[400], // fallback
                        '& .MuiInputBase-input': {
                          color: grey[800],       // input text color
                          // fontWeight: 'bold',     // ✅ make font bold
                        },
                        '& .MuiInputLabel-root': {
                          color: grey[400],       // label color
                          // fontWeight: 'bold',     // ✅ make label bold
                        },
                        '& .MuiInput-underline:before': {
                          borderBottomColor: grey[450], // underline before focus
                          borderBottomWidth: '1px',     // ✅ thicker underline
                        },
                        '& .MuiInput-underline:hover:before': {
                          borderBottomColor: grey[500], // underline on hover
                          borderBottomWidth: '2px',     // ✅ consistent thickness
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: grey[300], // underline after focus
                          borderBottomWidth: '2px',     // ✅ consistent thickness
                        },
                      }}

                    />
                  </Grid>
                  {/* Login Button */}
                  <Grid item xs={12}>
                    <CustomButton
                      type="submit"
                      loading={isLoading}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      Send Reset Link
                    </CustomButton>
                  </Grid>
                </Grid>
              </CardContent>
              <Grid
                sx={{
                  display: "flex",
                  textAlign: "center",
                  justifyContent: "center",
                  my: 5,
                }}
              >
                <StyledForgotEmail variant="body1">
                  Forgot email address?
                </StyledForgotEmail>
              </Grid>
            </form>
          </Grid>
        ) : (
          <Grid
            container
            spacing={5}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Card Grid */}
            <CardGrid item xs={12} md={6}>
              <CardContent>
                <Typography
                  variant="h3"
                  align="center"
                  gutterBottom
                  color={theme.palette.common.dark}
                >
                  Please check your email
                </Typography>
                {/* Title Grid */}
                <TitleGrid>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.grey[600], mt: 2 }}
                  >
                    An email has been sent to your {formik.values.email}. <br />
                    Please click on the link to reset your password.
                  </Typography>
                </TitleGrid>
                {/* Button grid */}
                <Grid container>
                  <Grid item xs={12}>
                    <CustomButton
                      type="submit"
                      loading={isLoading}
                      sx={{ mt: 2 }}
                      onClick={handleContinue}
                      fullWidth
                    >
                      Continue
                    </CustomButton>
                  </Grid>
                </Grid>
                {/* Link Grid */}
                <StyledLinkGrid>
                  <StyledTypography
                    variant="body3"
                    onClick={() => handleResendLink("not-receive")}
                  >
                    Not receive reset link?
                  </StyledTypography>
                  <StyledLink
                    variant="subtitle2"
                    onClick={() => handleResendLink("resend")}
                  >
                    Resend link
                  </StyledLink>
                </StyledLinkGrid>
              </CardContent>
            </CardGrid>
          </Grid>
        )}

        {/* Alert on the continue if user not verify the link */}
        <CustomAlert
          isOpen={isAlertOpen}
          setIsOpen={setIsAlertOpen}
          severity="error"
          message="Please check your email address before continue."
        />

        {/* {!isMailSent && (
          <Grid
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
          </Grid>
        )} */}
      </StyledGrid>
    </>
  );
};

export default ForgotPassword;
