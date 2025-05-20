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
  MenuItem,
  FormControl,
  InputLabel,
  Select as MuiSelect,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Snackbar,
  Slide,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../state/Auth/Action";
import { Visibility, VisibilityOff, Email, Person, Lock, HowToReg, Business, CheckCircle } from "@mui/icons-material";
import registerIllustration from "./assets/register-illustration.svg";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "ROLE_CUSTOMER",
};

const validationSchema = Yup.object({
  fullName: Yup.string()
    .required("Họ và tên không được để trống")
    .min(2, "Tên phải có ít nhất 2 ký tự"),
  email: Yup.string()
    .email("Định dạng email không hợp lệ")
    .required("Email không được để trống"),
  password: Yup.string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt"
    )
    .required("Mật khẩu không được để trống"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận phải khớp với mật khẩu')
    .required('Vui lòng xác nhận mật khẩu'),
  role: Yup.string().required("Loại tài khoản không được để trống"),
});

// Component hiệu ứng trượt
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  // Thêm state cho thông báo thành công
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Xử lý đóng thông báo thành công
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setRegisterSuccess(false);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setRegisterError(null);
    const userData = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      role: values.role,
    };

    console.log("Giá trị form đăng ký:", userData);

    dispatch(registerUser({
      userData,
      navigate
    }))
      .then((response) => {
        // Hiển thị thông báo thành công
        setSuccessMessage(`Tạo tài khoản thành công! Vui lòng đăng nhập để tiếp tục.`);
        setRegisterSuccess(true);
        resetForm();

        // Tự động chuyển đến trang đăng nhập sau 2 giây
        setTimeout(() => {
          navigate("/account/login");
        }, 2000);
      })
      .catch(error => {
        setRegisterError(error?.message || "Đăng ký thất bại. Vui lòng thử lại.");
        setSubmitting(false);
      });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        borderRadius: '16px',
      }}
    >
      {/* Thông báo thành công */}
      <Snackbar
        open={registerSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        TransitionComponent={SlideTransition}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSuccess}
          severity="success"
          icon={<CheckCircle />}
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Left side - Branding */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 4, md: 6 },
          width: isMobile ? '100%' : '50%',
          borderRadius: isMobile ? '16px 16px 0 0' : '16px 0 0 16px',
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Tham Gia Ngay
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 4, maxWidth: "80%" }}>
          Tạo tài khoản để bắt đầu đặt các món ăn ngon hoặc đăng ký làm chủ nhà hàng hoặc đối tác vận chuyển.
        </Typography>
        <Box
          component="img"
          src={registerIllustration}
          alt="Đăng ký"
          sx={{
            maxWidth: "70%",
            height: "auto",
          }}
        />
      </Box>

      {/* Right side - Registration Form */}
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: isMobile ? '100%' : '50%',
          borderRadius: isMobile ? '0 0 16px 16px' : '0 16px 16px 0',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ maxWidth: "450px", width: "100%", mx: "auto" }}>
          <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4, textAlign: "center" }}>
            Tạo Tài Khoản
          </Typography>

          {registerError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registerError}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, touched, errors, values, handleChange }) => (
              <Form>
                <Box sx={{ mb: 3 }}>
                  <Field name="fullName">
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        label="Họ và tên"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        error={touched.fullName && Boolean(errors.fullName)}
                        helperText={touched.fullName && errors.fullName}
                      />
                    )}
                  </Field>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Field name="email">
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
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    )}
                  </Field>
                </Box>

                <Box sx={{ mb: 3 }}>
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

                <Box sx={{ mb: 3 }}>
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        type={showConfirmPassword ? "text" : "password"}
                        label="Xác nhận mật khẩu"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                        helperText={touched.confirmPassword && errors.confirmPassword}
                      />
                    )}
                  </Field>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={touched.role && Boolean(errors.role)}
                  >
                    <InputLabel>Loại tài khoản</InputLabel>
                    <Field
                      as={MuiSelect}
                      name="role"
                      label="Loại tài khoản"
                      value={values.role}
                      onChange={handleChange}
                    >
                      <MenuItem value="ROLE_CUSTOMER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" /> Khách hàng
                        </Box>
                      </MenuItem>
                      <MenuItem value="ROLE_RESTAURANT_OWNER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Business fontSize="small" /> Chủ nhà hàng
                        </Box>
                      </MenuItem>
                      <MenuItem value="ROLE_SHIPPER">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HowToReg fontSize="small" /> Đối tác giao hàng
                        </Box>
                      </MenuItem>
                    </Field>
                    {touched.role && errors.role && (
                      <FormHelperText error>{errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    fontSize: "1.1rem",
                    fontWeight: "bold"
                  }}
                  startIcon={<HowToReg />}
                >
                  {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
                </Button>
              </Form>
            )}
          </Formik>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              HOẶC
            </Typography>
          </Divider>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{" "}
              <Button
                color="primary"
                sx={{ fontWeight: "bold" }}
                onClick={() => navigate("/account/login")}
              >
                Đăng nhập
              </Button>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;