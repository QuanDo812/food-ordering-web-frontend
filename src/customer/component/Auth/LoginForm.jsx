import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../state/Auth/Action";
import ReCAPTCHA from "react-google-recaptcha";
import { Visibility, VisibilityOff, Email, Lock, Login } from "@mui/icons-material";
import loginIllustration from "./assets/login-illustration.svg";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = Yup.object({
  username: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email không được để trống"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Mật khẩu không được để trống"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loginError, setLoginError] = useState(null);

  const handleSubmit = (values, { setSubmitting }) => {
    if (!captchaValue) {
      setLoginError("Vui lòng xác minh bạn không phải là robot");
      setSubmitting(false);
      return;
    }

    setLoginError(null);
    console.log("Giá trị form đăng nhập:", values);
    dispatch(loginUser({
      data: { ...values, recaptchaToken: captchaValue },
      navigate
    })).catch(error => {
      setLoginError(error?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.");
      setSubmitting(false);
    });
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
    setLoginError(null);
  };

  return (
    <Grid container sx={{ minHeight: "600px" }}>
      {/* Left side - Image or Design */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 4, md: 6 },
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Chào Mừng Trở Lại
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 4, maxWidth: "80%" }}>
          Đăng nhập để truy cập tài khoản và khám phá các món ăn ngon của chúng tôi.
        </Typography>
        <Box
          component="img"
          src={loginIllustration}
          alt="Đăng nhập"
          sx={{
            maxWidth: "70%",
            height: "auto",
          }}
        />
      </Grid>

      {/* Right side - Login Form */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column"
        }}
      >
        <Box sx={{ maxWidth: "450px", width: "100%", mx: "auto" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4, textAlign: "center" }}>
            Đăng nhập
          </Typography>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <Box sx={{ mb: 3 }}>
                  <Field name="username">
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Địa chỉ Email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        error={touched.username && Boolean(errors.username)}
                        helperText={touched.username && errors.username}
                      />
                    )}
                  </Field>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="Mật khẩu"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    )}
                  </Field>
                </Box>

                <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                  <ReCAPTCHA
                    sitekey="6LfBBTorAAAAAMPGQOMvLJOVsPNwyJrolTgQ8Cbv"
                    onChange={handleCaptchaChange}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting || !captchaValue}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "bold"
                  }}
                  startIcon={<Login />}
                >
                  {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Quên mật khẩu?{" "}
              <Button
                color="primary"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/account/reset-password")}
              >
                Đặt lại
              </Button>
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              HOẶC
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Chưa có tài khoản?{" "}
              <Button
                color="primary"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/account/register")}
              >
                Đăng ký
              </Button>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;