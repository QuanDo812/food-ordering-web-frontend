import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";

import { Avatar, Box, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Dashboard } from "@mui/icons-material";
import ShopTwoIcon from "@mui/icons-material/ShopTwo";
import { logout } from "../state/Auth/Action";
import EventIcon from "@mui/icons-material/Event";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CategoryIcon from '@mui/icons-material/Category';
import FastfoodIcon from '@mui/icons-material/Fastfood';

const menu = [
  { title: "Dashboard", icon: <Dashboard />, path: "/" },
  { title: "Orders", icon: <ShoppingBagIcon />, path: "/orders" },
  { title: "Menu", icon: <ShopTwoIcon />, path: "/menu" },
  { title: "Food Category", icon: <CategoryIcon />, path: "/category" },
  { title: "Ingredients", icon: <FastfoodIcon />, path: "/ingredients" },
  { title: "Events", icon: <EventIcon />, path: "/event" },
  { title: "Details", icon: <AdminPanelSettingsIcon />, path: "/details" },
  { title: "Logout", icon: <LogoutIcon />, path: "/" },
  
];
export default function AdminSidebar({ handleClose, open }) {
  const isSmallScreen = useMediaQuery("(max-width:1080px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {restaurant}=useSelector(store=>store);


  const handleNavigate = (item) => {
    navigate(`/admin/restaurant${item.path}`);
    if (item.title === "Logout") {
      navigate("/");
      dispatch(logout());
    } else if (item.title === "Restaurants") {
      navigate("/admin");
    }
    handleClose()
  };

  return (
    <Box
      sx={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid #ccc",
        // boxShadow: "2px 0px 5px rgba(0,0,0,0.1)",
        position: "sticky",
    top: 0, // Cố định sidebar ở trên cùng
left: 0,
        padding: 2,
      }}
    >

      {/* Danh sách menu */}
      <List>
        {menu.map((item, index) => (
          <ListItem
          button
          
          onClick={()=>handleNavigate(item)}
          key={index}
          sx={{
            marginTop: "10px",
            cursor: 'pointer',
            "&:hover": {
              backgroundColor: "#f5f5f5", // Màu nền khi hover
              "& .MuiListItemText-primary": { color: "#ff5733" }, // Màu chữ khi hover
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
        </ListItem>
        ))}
      </List>
    </Box>
  );
}
