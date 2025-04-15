import { Alert, Box, Button, Modal, Snackbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

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

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  

  return (
    <>
      <Modal
        open={
          location.pathname === "/account/register" ||
          location.pathname === "/account/login"
         
        }
        onClose={() => navigate("/")}
      >
        <Box sx={style}>
          {location.pathname === "/account/register" ? (
            <RegisterForm />
          ) :  
            <LoginForm/>
          }
          
        </Box>
      </Modal>
    </>
  );
};

export default Auth;
