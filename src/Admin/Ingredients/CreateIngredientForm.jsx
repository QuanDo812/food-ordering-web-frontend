import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import {
  Create as CreateIcon,
  InventoryOutlined as InventoryIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../state/Admin/Ingredients/Action';



const CreateIngredientForm = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { auth, restaurant, ingredients } = useSelector(store => store)
  const jwt = sessionStorage.getItem("jwt")


  const [formData, setFormData] = useState({
    name: '',
    ingredientCategoryId: '',
    price: ''
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted:', formData);

    setFormData({
      name: '',
      ingredientCategoryId: '',
      price: ''
    })
    handleClose()
    const data = { ...formData, restaurantId: restaurant.usersRestaurant.id }
    dispatch(createIngredient({ jwt: auth.jwt || jwt, data }))

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
          <InventoryIcon sx={{ color: '#ea580c', fontSize: 28 }} />
          <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: 600 }}>
            Thêm nguyên liệu mới
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
          label="Tên nguyên liệu"
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

        <TextField
          fullWidth
          label="Giá"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
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

        <FormControl fullWidth required>
          <InputLabel sx={{ '&.Mui-focused': { color: '#ea580c' } }}>
            Loại nguyên liệu
          </InputLabel>
          <Select
            value={formData.ingredientCategoryId}
            label="Loại nguyên liệu"
            name='ingredientCategoryId'
            onChange={handleInputChange}
            sx={{
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ea580c',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ea580c',
              }
            }}
          >
            {ingredients.category.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
            Tạo nguyên liệu
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateIngredientForm;
