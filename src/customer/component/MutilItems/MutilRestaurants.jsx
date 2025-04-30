import React from 'react'
import RestaurantCard from '../Restaurant/RestaurantCard';
import { Box, Button, Divider } from '@mui/material';
import Slider from 'react-slick';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';



const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowBackIos
      className={className}
      onClick={onClick}
      style={{ ...style, color: "#fe6d2e", fontSize: "36px", left: "-50px" }}
    />
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <ArrowForwardIos
      className={className}
      onClick={onClick}
      style={{ ...style, color: "#fe6d2e", fontSize: "36px", right: "-50px" }}
    />
  );
};


const MutilRestaurants = ({ restaurants }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <CustomPrevArrow />, // Nút trái
    nextArrow: <CustomNextArrow />, // Nút phải
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box mt={5} >
      {/* Tiêu đề */}
      <h2 style={{ fontSize: "26px", fontWeight: "bold" }}>
        Ưu đãi Food tại <span style={{ color: "#fe6d2e" }}>PTIT FOOD</span>
      </h2>

      {/* Slider chứa các card */}
      <Box sx={{ width: "100%", margin: "auto", mt: 3, overflow: "visible" }}>
        <Slider {...settings} sx={{ padding: "0 9px" }}>
          {restaurants.map(item => (
            <RestaurantCard key={item?.id} restaurant={item} />
          ))}
        </Slider>
      </Box>


      {/* Nút xem thêm */}
      <Box display="flex" justifyContent="center">
        <Button
          variant="outlined"
          fullWidth
          sx={{
            mt: 3,
            color: "#fe6d2e",
            borderColor: "#fe6d2e",
            "&:hover": { backgroundColor: "#fe6d2e", borderColor: "darkorange", color: "white" }
          }}
        >
          See all promotions
        </Button>
      </Box>

    </Box>
  )
}

export default MutilRestaurants
