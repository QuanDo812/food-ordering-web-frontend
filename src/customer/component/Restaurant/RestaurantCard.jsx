import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, IconButton, Chip } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useNavigate } from "react-router-dom";
import { isPresentInFavorites } from "../../component/config/logic"
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites } from "../../../state/Auth/Action"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";



const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { auth } = useSelector((store) => store);
  const jwt = sessionStorage.getItem("jwt");

  const dispatch = useDispatch();

  const handleAddToFavorites = () => {
    dispatch(addToFavorites({ restaurantId: restaurant.id, jwt: auth.jwt || jwt }));
  };



  const navigateToRestaurant = () => {
    if (restaurant?.open)
      navigate(`/restaurant/${restaurant.title}/${restaurant.id}`);
  };


  return (
    <Card sx={{
      width: 300, minHeight: 320,
      cursor: restaurant.open ? "pointer" : "not-allowed", //open or close
      position: "relative", // Để đặt Chip lên ảnh
      border: "none",
      boxShadow: 'none'
    }}

    >
      <Chip
        size="small"

        className="absolute top-2 left-2"
        color={restaurant?.open ? "success" : "error"}
        label={restaurant?.open ? "Open" : "Closed"}
      />
      {/* Hình ảnh */}
      <CardMedia onClick={navigateToRestaurant} component="img" height="160" image={restaurant?.images[0]} alt={restaurant?.title} sx={{ objectFit: "cover", borderRadius: "7px" }} />

      {/* Nội dung */}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Tên món ăn */}
        <Typography sx={{
          whiteSpace: "normal",  // Cho phép xuống dòng
          overflowWrap: "break-word",
          wordBreak: "break-word",
        }} variant="h6" fontWeight="bold">
          {restaurant?.title}
        </Typography>

        {/* Loại món ăn */}
        <Typography sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis"
        }}
          variant="body2" color="text.secondary">
          {restaurant?.description}
        </Typography>

        {/* Đánh giá, thời gian, khoảng cách */}
        <Box display="flex" alignItems="center" mt={1} color="gray">
          <StarIcon sx={{ fontSize: "18px", color: "gold" }} />
          <Typography variant="body2" sx={{ mx: 0.5 }}>
            {(restaurant?.rating) != null ? (restaurant?.rating).toFixed(1) : 4}
          </Typography>

          <AccessTimeIcon sx={{ fontSize: "18px", mx: 1 }} />
          <Typography variant="body2">
            {(restaurant?.hours) != null ? (restaurant?.hours).toFixed(1) : 10} phút
          </Typography>

          <Typography variant="body2" sx={{ mx: 1 }}>• {(restaurant?.distance) != null ? (restaurant?.distance).toFixed(1) : 2} km</Typography>
          <IconButton onClick={handleAddToFavorites}>
            {isPresentInFavorites(auth.favorites, restaurant) ? (
              <FavoriteIcon sx={{ color: "#fe6d2e" }} />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>

        {/* Khuyến mãi */}
        {/* {restaurant.promo && (
          <Box display="flex" alignItems="center" mt={1} color="green">
            <LocalOfferIcon sx={{ fontSize: "18px" }} />
            <Typography variant="body2" sx={{ ml: 0.5,  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"  }}>{restaurant.promo}</Typography>
          </Box>
        )} */}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
