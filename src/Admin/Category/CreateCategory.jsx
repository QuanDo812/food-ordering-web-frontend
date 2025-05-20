import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { Create, RestaurantMenu } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCategoryAction } from '../../state/Customer/Restaurant/Action';



const CreateCategory = ({ handleClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector(store => store)
  const jwt = sessionStorage.getItem("jwt")

  const [formData, setFormData] = useState({
    categoryName: '',
    restaurantId: '',
  });

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const data = {
      name: formData.categoryName,
      restaurant: {
        id
      }
    }
    dispatch(createCategoryAction({ reqData: data, jwt: auth.jwt || jwt }))
    setFormData({
      categoryName: '',
      restaurantId: '',
    })
    handleClose()
    console.log('Form submitted:', formData);
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
      <Box className="flex items-center gap-2 mb-6">
        <RestaurantMenu sx={{ color: '#ea580c' }} />
        <Typography
          variant="h6"
          sx={{
            color: '#ea580c',
            fontWeight: 600
          }}
        >
          Thêm danh mục món ăn
        </Typography>
      </Box>

      <form
        onSubmit={handleFormSubmit}
        className="space-y-6"
      >
        <TextField
          label="Tên danh mục"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
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
            startIcon={<Create />}
            sx={{
              backgroundColor: '#ea580c',
              '&:hover': {
                backgroundColor: '#c2410c',
              }
            }}
          >
            Tạo danh mục
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateCategory;
