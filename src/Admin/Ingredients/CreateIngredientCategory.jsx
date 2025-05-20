import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import {
  Create as CreateIcon,
  CategoryOutlined as CategoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createIngredientCategory } from "../../state/Admin/Ingredients/Action";

const CreateIngredientCategoryForm = ({ handleClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector((store) => store);
  const jwt = sessionStorage.getItem("jwt");

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
    });
    const data = {
      name: formData.name,
      restaurantId: restaurant.usersRestaurant.id,
    };
    dispatch(createIngredientCategory({ data, jwt: auth.jwt || jwt }));
    handleClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Box className="w-full">
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box className="flex items-center gap-2">
          <CategoryIcon sx={{ color: '#ea580c', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: 600 }}>
            Thêm loại nguyên liệu mới
          </Typography>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: '#94a3b8',
            '&:hover': { color: '#475569' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <TextField
          label="Tên loại nguyên liệu"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          required
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#ea580c',
              },
              '&:hover fieldset': {
                borderColor: '#ea580c',
              }
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#ea580c',
            }
          }}
        />

        <Box className="flex gap-3 justify-end pt-4">
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              color: '#ea580c',
              borderColor: '#ea580c',
              '&:hover': {
                borderColor: '#c2410c',
                backgroundColor: '#fff7ed',
              }
            }}
          >
            Hủy
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<CreateIcon />}
            sx={{
              backgroundColor: '#ea580c',
              '&:hover': {
                backgroundColor: '#c2410c',
              }
            }}
          >
            Tạo loại
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateIngredientCategoryForm;
