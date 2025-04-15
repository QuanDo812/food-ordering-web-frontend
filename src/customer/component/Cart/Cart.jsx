import { Button, Card, Divider, IconButton, Snackbar } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";


import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Box, Modal, Grid, TextField } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CartItemCard from "./CartItemCard";
import AddressCard from "./AddressCard";
import { useDispatch, useSelector } from "react-redux";
import { findCart } from "../../state/Customer/Cart/Action";
import { createOrder } from "../../state/Customer/Order/Action";
import { isValid } from "../../util/validation";

const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};

const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street Address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  city: Yup.string().required("City is required"),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};


const Cart = () => {
  const [openSnackbar, setOpenSnakbar] = useState();
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const dispatch = useDispatch()

  const {cart, auth} = useSelector((store)=>store)
  console.log("cart: ", cart)
  

  console.log("auth: ", auth)
  console.log("jwt: ", localStorage.getItem("jwt"))
  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
  };

  useEffect(() => {
    dispatch(findCart(auth?.jwt || localStorage.getItem("jwt")));
  }, [cart.cartItems]);
  console.log("cart in cartPage: ", cart?.cart?.cartItems)

  const handleOpenAddressModal = () => setOpenAddressModal(true);
  const handleSubmit = (values) => {
    const data = {
      jwt: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart?.cart?.cartItems[0].food?.restaurant?.id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          street: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: "VietNam",
        }
      },
    };

    console.log("data",data)
    console.log("cartItems: ", cart?.cart?.cartItems)
    
    dispatch(createOrder(data));
  };

  const createOrderUsingSelectedAddress = (deliveryAddress) => {
    const data = {
      token: localStorage.getItem("jwt"),
      order: {
        restaurantId: cart.cartItems[0].food.restaurant.id,
        deliveryAddress: {
          fullName: "ashok",
          street: "gujrat",
          city: "gujrat",
          state: "gujrat",
          postalCode: "599000",
          country: "India",
        },
      },
    };
    if (isValid(cart.cartItems)) {
      dispatch(createOrder(data));
    } else setOpenSnakbar(true);
  };

  const handleCloseSankBar = () => setOpenSnakbar(false);

  return (
    <Fragment>
      {cart?.cart?.cartItems.length > 0 ? (
        <main className="lg:flex justify-between">
          <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
            {cart?.cart?.cartItems.map((item, i) => (
              <CartItemCard key={i} item={item} />
            ))}

            <Divider />
            <div className="billDetails px-5 text-sm">
              <p className="font-extralight py-5">Chi tiết đơn hàng</p>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <p>Tổng giá tiền</p>
                  <p>{cart?.cart?.total} VNĐ</p>
                </div>
                <div className="flex justify-between text-gray-400">
                <p>Phí vận chuyển</p>
                <p>10000 VNĐ</p>
              </div>
                <div className="flex justify-between text-gray-400">
                <p>Thuế</p>
                <p>1 %</p>
              </div>
                <div className="flex justify-between text-gray-400">
                <p>GST and Restaurant Charges</p>
                <p>10 VNĐ</p>
              </div>
                <Divider />
                <div className="flex justify-between text-gray-400">
                  <p>Tổng thanh toán</p>
                  <p>{cart?.cart?.total*1.01 + 10000} VNĐ</p>
                </div>
              </div>
            </div>
          </section>
          <Divider orientation="vertical" flexItem />
          <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
            <div className="">
              <h1 className="text-center font-semibold text-2xl py-10">
              Choose Delivery Address
            </h1>
            <div className="flex gap-5 flex-wrap justify-center">
              {auth.user?.addresses.map((item, index) => (
                <AddressCard
                  handleSelectAddress={createOrderUsingSelectedAddress}
                  item={item}
                  showButton={true}
                />
              ))}

              <Card className="flex flex-col justify-center items-center p-5  w-64 ">
                <div className="flex space-x-5">
                  <AddLocationAltIcon />
                  <div className="space-y-5">
                    <p>Add New Address</p>
                    <Button
                      onClick={handleOpenAddressModal}
                      sx={{ padding: ".75rem" }}
                      fullWidth
                      variant="contained"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            </div>
        
          </section>
        </main>
      ) : (
        <div className="flex h-[90vh] justify-center items-center">
          <div className="text-center space-y-5">
            <RemoveShoppingCartIcon sx={{ width: "10rem", height: "10rem" }} />
            <p className="font-bold text-3xl">Your Cart Is Empty</p>
          </div>
        </div>
      )}
      <Modal open={openAddressModal} onClose={handleCloseAddressModal}>
        <Box sx={style}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    name="streetAddress"
                    as={TextField}
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="state"
                    as={TextField}
                    label="State"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("state")}
                    helperText={
                      <ErrorMessage name="state">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="pincode"
                    as={TextField}
                    label="Pincode"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("pincode")}
                    helperText={
                      <ErrorMessage name="pincode">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="city"
                    as={TextField}
                    label="City"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("city")}
                    helperText={
                      <ErrorMessage name="city">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Deliver Here
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
      <Snackbar
        severity="success"
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSankBar}
        message="Please Add Items Only From One Restaurants At time"
      />
    </Fragment>
  );
};

export default Cart;
