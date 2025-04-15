import React, { useEffect, useState } from "react";
import {
  TextField, Button, FormControl, InputLabel, Select,
  MenuItem, Grid, CircularProgress, IconButton, Snackbar,
  Box, Chip, OutlinedInput, Alert, Container, Typography
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadToCloudinary } from "../utils/UploadToCloudnary";
import { createMenuItem } from "../../state/Customer/Menu/Action";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().typeError("Price must be a number").required().min(0),
  imageUrl: Yup.string().url().required("Image URL is required"),
  vegetarian: Yup.boolean().required(),
  seasonal: Yup.boolean().required(),
  quantity: Yup.number().typeError("Quantity must be a number").required().min(0),
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
  const jwt = localStorage.getItem("jwt");
  const [uploadImage, setUploadingImage] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      values.restaurantId = restaurant.usersRestaurant.id;
      dispatch(createMenuItem({ menu: values, jwt: auth.jwt || jwt }));
    },
  });

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  useEffect(() => {
    if (menu.message || menu.error) setOpenSnackBar(true);
  }, [menu.message, menu.error]);

  const handleCloseSnackBar = () => setOpenSnackBar(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>Add New Menu Item</Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} direction="column">

          <Grid item>
            <Typography variant="subtitle1" mb={1}>Upload Images</Typography>
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
                    width: 96, height: 96, border: '2px dashed gray',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', borderRadius: 2,
                  }}
                >
                  {uploadImage ? <CircularProgress size={24} /> : <AddPhotoAlternateIcon />}
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
          </Grid>

          <Grid item>
            <TextField fullWidth label="Name" name="name" value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>

          <Grid item>
            <TextField fullWidth label="Description" name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>

          <Grid item container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Price" name="price" type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Quantity" name="quantity" type="number"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
              />
            </Grid>
          </Grid>

            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Food Category</InputLabel>
                <Select label="Food Category" name="category" value={formik.values.category} onChange={formik.handleChange}>
                  {restaurant.categories.map((item) => (
                    <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Ingredients</InputLabel>
                <Select
                  multiple
                  name="ingredients"
                  value={formik.values.ingredients}
                  onChange={formik.handleChange}
                  input={<OutlinedInput label="Ingredients" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value.id} label={value.name} />
                      ))}
                    </Box>
                  )}
                >
                  {ingredients.ingredients.map((item) => (
                    <MenuItem key={item.id} value={item}>{item.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

          <Grid item>
            <Button fullWidth variant="contained" type="submit">Add Menu Item</Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={menu.error ? "error" : "success"} sx={{ width: "100%" }}>
          {menu.message || auth.error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddMenuForm;
