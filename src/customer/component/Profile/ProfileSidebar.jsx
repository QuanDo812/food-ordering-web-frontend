import { Box, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LockIcon from "@mui/icons-material/Lock";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../state/Auth/Action";
import LogoutIcon from "@mui/icons-material/Logout";


const menuItems = [
  { text: "Tài Khoản Của Tôi", icon: <AccountCircleIcon />, url: "Account" },
  { text: "Thông Báo", icon: <NotificationsIcon />, url: "Notification" },
  { text: "Địa Chỉ", icon: <LocationOnIcon />, url: "Address" },
  { text: "Đổi Mật Khẩu", icon: <LockIcon />, url: "reset-password" },
  { text: "Đơn Mua", icon: <ShoppingCartIcon />, url: "Orders" },
  { text: "Yêu thích", icon: <CardGiftcardIcon />, url: "Favorites" },
  { text: "Đăng xuất", icon: <LogoutIcon />, url: "Logout" },
];

const ProfileSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store)
  const handleNavigate = (item) => {
    navigate(`/my-profile/${item.url.toLowerCase()}`);
    if (item.url === "Logout") {
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
      {/* Avatar và tên người dùng */}
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", mb: 2 }}>
        <Avatar sx={{ width: 64, height: 64, mb: 1 }} />
        <Typography fontWeight="bold">{auth?.user?.email || "o0_en09d7b"}</Typography>
        <Typography variant="body2" color="textSecondary">
          Sửa Hồ Sơ
        </Typography>
      </Box>

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

export default ProfileSidebar;
