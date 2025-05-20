import React from "react";
import { Box, Container, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";

const Auth = () => {
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 5
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            overflow: "hidden",
            borderRadius: "16px",
          }}
        >
          {location.pathname === "/account/login" ? (
            <LoginForm />
          ) : (

            <RegisterForm />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;