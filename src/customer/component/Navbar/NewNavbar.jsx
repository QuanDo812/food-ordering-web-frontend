import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaPhone } from "react-icons/fa";

const NewNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: "Home", path: "/", icon: <FaHome /> },
    { text: "About", path: "/about", icon: <FaInfoCircle /> },
    { text: "Contact", path: "/contact", icon: <FaPhone /> },
  ];

  return (
    <AppBar position="static" className="bg-green-600 shadow-md">
      <Toolbar className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Typography variant="h6" component={Link} to="/" className="text-white font-bold text-xl">
          MyWebsite
        </Typography>

        {/* Menu lớn (hiện trên Desktop) */}
        <Box className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <Typography key={item.text} component={Link} to={item.path} className="text-white hover:text-gray-300">
              {item.text}
            </Typography>
          ))}
        </Box>

        {/* Nút mở menu (hiện trên Mobile) */}
        <IconButton edge="end" color="inherit" onClick={handleDrawerToggle} className="md:hidden">
          <MenuIcon />
        </IconButton>
      </Toolbar>

      {/* Menu Drawer (hiện trên Mobile) */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box className="w-64 p-4">
          <IconButton onClick={handleDrawerToggle} className="mb-4">
            <CloseIcon />
          </IconButton>
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.path} onClick={handleDrawerToggle}>
                <span className="mr-2">{item.icon}</span>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default NewNavbar;
