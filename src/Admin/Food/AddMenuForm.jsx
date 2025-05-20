import React, { useEffect, useState } from "react";
import {
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, Grid, CircularProgress, IconButton,
  Box, Chip, OutlinedInput, Container, Typography
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createMenuItem } from "../../state/Customer/Menu/Action";
// Import React-Toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Import Icons cho toasts
import { CheckCircle, Error } from "@mui/icons-material";

const validationSchema = Yup.object({
  name: Yup.string().required("Tên món ăn không được để trống"),
  description: Yup.string().required("Mô tả không được để trống"),
  price: Yup.number().typeError("Giá phải là số").required("Vui lòng nhập giá").min(0, "Giá không thể âm"),
  vegetarian: Yup.boolean().required("Vui lòng chọn"),
  seasonal: Yup.boolean().required("Vui lòng chọn"),
  quantity: Yup.number().typeError("Số lượng phải là số").required("Vui lòng nhập số lượng").min(0, "Số lượng không thể âm"),
  category: Yup.object().required("Vui lòng chọn danh mục"),
  images: Yup.array().min(1, "Vui lòng tải lên ít nhất 1 hình ảnh"),
});

const initialValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  images: [],
  restaurantId: "",
  vegetarian: true,
  seasonal: false,
  quantity: 0,
  ingredients: [],
};

const AddMenuForm = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { restaurant, ingredients, auth, menu } = useSelector((store) => store);
  const jwt = sessionStorage.getItem("jwt");
  const [uploadImage, setUploadingImage] = useState(false);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      values.restaurantId = restaurant.usersRestaurant.id;

      // Hiển thị toast đang xử lý
      const processingToast = toast.info(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} style={{ marginRight: '10px', color: 'white' }} />
          <span>Đang tạo món ăn mới...</span>
        </div>,
        { autoClose: false, toastId: 'processing-menu' }
      );

      dispatch(createMenuItem({ menu: values, jwt: auth.jwt || jwt }))
        .then((response) => {
          // Đóng toast đang xử lý
          toast.dismiss(processingToast);

          // Hiển thị toast thành công
          toast.success(
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CheckCircle style={{ marginRight: '10px' }} />
              <span>Tạo món ăn thành công!</span>
            </div>,
            { autoClose: 3000 }
          );

          // Reset form sau khi tạo thành công
          resetForm();
        })
        .catch((error) => {
          // Đóng toast đang xử lý
          toast.dismiss(processingToast);

          // Hiển thị toast lỗi
          toast.error(
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Error style={{ marginRight: '10px' }} />
              <span>{error?.message || "Tạo món ăn thất bại. Vui lòng thử lại."}</span>
            </div>,
            { autoClose: 5000 }
          );
        });
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);

    try {
      const image = await uploadToCloudinary(file);
      formik.setFieldValue("images", [...formik.values.images, image]);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  useEffect(() => {
    // Hiển thị thông báo lỗi hoặc thành công từ state
    if (menu.error) {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Error style={{ marginRight: '10px' }} />
          <span>{menu.error}</span>
        </div>,
        { autoClose: 5000 }
      );
    }
  }, [menu.error]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* React-Toastify Container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Typography
        variant="h5"
        fontWeight="bold"
        mb={3}
        sx={{ color: '#ea580c' }}
      >
        Thêm món ăn mới
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <Typography variant="subtitle1" mb={1} sx={{ color: '#ea580c' }}>
              Tải lên hình ảnh
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
              <label htmlFor="fileInput">
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
                <Box
                  sx={{
                    width: 96,
                    height: 96,
                    border: '2px dashed #ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: 2,
                  }}
                >
                  {uploadImage ? (
                    <CircularProgress size={24} sx={{ color: '#ea580c' }} />
                  ) : (
                    <AddPhotoAlternateIcon sx={{ color: '#ea580c' }} />
                  )}
                </Box>
              </label>

              {formik.values.images.map((img, i) => (
                <Box key={i} sx={{ position: 'relative' }}>
                  <img src={img} alt={`img-${i}`} style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8 }} />
                  <IconButton
                    onClick={() => handleRemoveImage(i)}
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
            {formik.touched.images && formik.errors.images && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {formik.errors.images}
              </Typography>
            )}
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              label="Tên món"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ea580c',
                }
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              fullWidth
              label="Mô tả"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#ea580c',
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#ea580c',
                }
              }}
            />
          </Grid>

          <Grid item container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Giá"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                InputProps={{
                  endAdornment: <Typography variant="body2" sx={{ color: 'text.secondary' }}>VNĐ</Typography>
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#ea580c',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#ea580c',
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Số lượng"
                name="quantity"
                type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#ea580c',
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#ea580c',
                  }
                }}
              />
            </Grid>
          </Grid>

          <Grid item xs={12} md={12}>
            <FormControl fullWidth error={formik.touched.category && Boolean(formik.errors.category)}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#ea580c' } }}>
                Danh mục món ăn
              </InputLabel>
              <Select
                label="Danh mục món ăn"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ea580c',
                  }
                }}
              >
                {restaurant.categories.map((item) => (
                  <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {formik.errors.category}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={12}>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: '#ea580c' } }}>Thành phần</InputLabel>
              <Select
                multiple
                label="Thành phần"
                name="ingredients"
                value={formik.values.ingredients}
                onChange={formik.handleChange}
                input={<OutlinedInput label="Thành phần" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value.id} label={value.name} />
                    ))}
                  </Box>
                )}
                sx={{
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ea580c',
                  }
                }}
              >
                {ingredients.ingredients.map((item) => (
                  <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#ea580c',
                '&:hover': {
                  backgroundColor: '#c2410c',
                },
                py: 1.5
              }}
              disabled={formik.isSubmitting}
              startIcon={formik.isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {formik.isSubmitting ? "Đang xử lý..." : "Thêm món ăn"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default AddMenuForm;