import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  Radio,
  FormControlLabel,
  Avatar,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../../../state/Auth/Action";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const {auth} = useSelector((store) => store)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleResetPassword = () => {
    navigate('/my-profile/reset-password')
  }

  const handleUpdateProfile = () => {
    const req = {
      email: auth?.user?.email,
      fullName: formik.values.name,
      gender: formik.values.gender,
      phone: formik.values.phone,
      dob: `${formik.values.day}-${formik.values.month}-${formik.values.year}`,
    };
    
    dispatch(updateProfile(req,auth?.jwt||localStorage.getItem("jwt")))
  }
  

  const formik = useFormik({
    initialValues: {
      username: auth?.user?.email,
      name: auth?.user?.fullName,
      phone: auth?.user?.phone || "3333333333",
      gender: auth?.user?.gender || "Nam",
      day: auth?.user?.dob.substring(0, 2) || "",
      month: auth?.user?.dob.substring(3, 5) || "",
      year: auth?.user?.dob.substring(6) || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập tên"),
      gender: Yup.string().required("Chọn giới tính"),
      day: Yup.string().required("Chọn ngày"),
      month: Yup.string().required("Chọn tháng"),
      year: Yup.string().required("Chọn năm"),
      phone: Yup.string()
      .required("Vui lòng nhập số điện thoại")
      .matches(/^\d{10}$/, "Số điện thoại phải có đúng 10 chữ số"),
    
    }),
    onSubmit: handleUpdateProfile
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1024 * 1024) {
      setSelectedFile(URL.createObjectURL(file));
    } else {
      alert("File quá lớn. Dung lượng tối đa là 1MB.");
    }
  };

  return (
    <Box className="max-w-4xl mx-auto p-8 mt-10 rounded-lg bg-white">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Hồ Sơ Của Tôi
      </Typography>
      <Typography className="text-gray-500 mt-6 mb-10">
        Quản lý thông tin hồ sơ để bảo mật tài khoản
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Box className="flex flex-col md:flex-row mt-6 gap-8">
          <Box className="flex-1 space-y-4">
            <TextField
              label="Tên đăng nhập"
              name="username"
              value={formik.values.username}
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Tên"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />


              <TextField
                label="Số điện thoại"
                name="phone"
                value={formik.values.phone}
                fullWidth
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              />

            <Box>
              <Typography className="mb-1">Giới tính</Typography>
              <RadioGroup
                row
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
              >
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
              </RadioGroup>
              {formik.touched.gender && formik.errors.gender && (
                <Typography className="text-red-500 text-sm mt-1">{formik.errors.gender}</Typography>
              )}
            </Box>

            <Box className="flex gap-4">
              <TextField
                select
                label="Ngày"
                name="day"
                value={formik.values.day}
                onChange={formik.handleChange}
                fullWidth
                error={formik.touched.day && Boolean(formik.errors.day)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200, // hoặc 100 nếu bạn muốn thấp hơn
                      },
                    },
                  },
                }}
              
                
              >
                {[...Array(31)].map((_, i) => (
                  <MenuItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                    {i + 1}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Tháng"
                name="month"
                value={formik.values.month}
                onChange={formik.handleChange}
                fullWidth
                error={formik.touched.month && Boolean(formik.errors.month)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200, // hoặc 100 nếu bạn muốn thấp hơn
                      },
                    },
                  },
                }}
                
              >
                {["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Năm"
                name="year"
                value={formik.values.year}
                onChange={formik.handleChange}
                fullWidth
                error={formik.touched.year && Boolean(formik.errors.year)}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200, // hoặc 100 nếu bạn muốn thấp hơn
                      },
                    },
                  },
                }}
                
              >
                {[...Array(100)].map((_, i) => {
                  const y = 2020 - i;
                  return (
                    <MenuItem key={y} value={String(y)}>
                      {y}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>

<Box className="flex gap-4">

            <Button
              type="submit"
              variant="contained"
              sx ={{bgcolor: "#FF5722"}}
              className="mt-4 w-32"
            >
              Lưu
            </Button>

            <Button
              onClick={handleResetPassword}
              variant="contained"
              className="w-60"
            >
              Thay đổi mật khẩu
            </Button>
            </Box>
          </Box>

          <Box className="flex flex-col items-center gap-4">
            <Avatar src={selectedFile} sx={{ width: 100, height: 100 }} />
            <Button variant="outlined" component="label">
              Chọn Ảnh
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            <Typography className="text-sm text-gray-500 text-center">
              Dung lượng file tối đa 1 MB<br />
              Định dạng: .JPEG, .PNG
            </Typography>
          </Box>
        </Box>
      </form>
      <Box className="mt-10">
      
            </Box>
    </Box>
  );
};

export default UserProfile;
