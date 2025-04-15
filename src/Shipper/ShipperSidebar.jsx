import React from "react";
import { useNavigate } from "react-router-dom";
import { List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import HistoryIcon from "@mui/icons-material/History";
import { Box } from "@mui/system";
import { logout } from "../state/Auth/Action";
import { useDispatch, useSelector } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";



const menuItems = [
    { text: "Thông tin đơn hàng", icon: <LocalShippingIcon />, url: "" },
    { text: "Đơn hàng đang giao", icon: <HistoryIcon />, url: "delivering" },
    { text: "Đơn hàng giao thành công", icon: <HistoryIcon />, url: "completing" },
    { text: "Đăng xuất", icon: <LogoutIcon />, url: "logout" },
];

const ShipperSidebar = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { auth } = useSelector((store) => store)
    const handleNavigate = (item) => {
        navigate(`/shipper/${item.url.toLowerCase()}`);
        if (item.url === "logout") {
            console.log('logout success')
            dispatch(logout())
            navigate('/')
        }
    }

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
                {menuItems.map((item, index) => (
                    <ListItem
                        button

                        onClick={() => handleNavigate(item)}
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
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ShipperSidebar;