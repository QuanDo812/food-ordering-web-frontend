import { Divider, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TodayIcon from '@mui/icons-material/Today';
import CategoryCard from "./CategoryCard";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAllRestaurantsDistance, getRestaurantById, getRestaurantsCategory } from "../../../state/Customer/Restaurant/Action";
import { getMenuItemsByRestaurantId } from "../../../state/Customer/Menu/Action";
import { AccessTime, DeliveryDining, LocationOn, Star, Today } from "@mui/icons-material";
import CommentIcon from '@mui/icons-material/Comment';
import { ClipLoader } from 'react-spinners'; // Spinner từ react-spinners



const RestaurantPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { auth, restaurant, menu } = useSelector((store) => store);

  // const decodedQueryString = decodeURIComponent(location.search);
  // const searchParams = new URLSearchParams(decodedQueryString);
  // const foodType = searchParams.get("food_type");
  // const foodCategory = searchParams.get("food_category");
  const jwt = auth?.jwt || localStorage.getItem("jwt")


  useEffect(() => {
    dispatch(getRestaurantsCategory({ restaurantId: id }))
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId: id
      })
    );
    dispatch(getAllRestaurantsDistance({
      address: localStorage.getItem("address")
    }))



  }, [id]);
  const restaurantItem = restaurant?.restaurants.find(item => item.id == id)


  return (

    <div className="px-5 lg:px-20 ">
      {restaurant?.restaurants.length === 0 ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : (
        <>
          <section>
            <h3 className="text-gray-500 py-2 mt-10">
              {`Home/Restaurant/${id}/Order Online`}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {/* Ảnh đầu tiên chiếm toàn bộ chiều ngang */}
              <img
                className="w-full h-[40vh] object-cover col-span-1 lg:col-span-2"
                src={restaurantItem?.images[0]}
                alt="Ảnh 1"
              />

              {/* Hai ảnh bên dưới chia 2 cột */}
              <img
                className="w-full h-[40vh] object-cover"
                src={restaurantItem?.images[1]}
                alt="Ảnh 2"
              />
              <img
                className="w-full h-[40vh] object-cover"
                src={restaurantItem?.images[2]}
                alt="Ảnh 3"
              />
            </div>

            <div className="pt-3 pb-5 cursor-pointer">
              {/* Tên & Mô tả */}
              <h1 className="text-4xl font-semibold">{restaurantItem?.name}</h1>
              <p className="text-gray-500 mt-1">{restaurantItem?.description}</p>

              <div className="space-y-3 mt-3">
                {/* Địa chỉ */}
                <p className="text-gray-500 flex items-center gap-3">
                  <LocationOn className="text-orange-500" />
                  <span>
                    {`${restaurantItem?.address?.detailAddress}, ${restaurantItem?.address?.ward}, ${restaurantItem?.address?.district}, ${restaurantItem?.address?.province}`}
                  </span>
                </p>

                {/* Giờ mở cửa & trạng thái */}
                <p className="flex items-center gap-3 text-gray-500">
                  <Today className="text-orange-500" />
                  <span className="text-orange-300">{restaurantItem?.openingHours}</span>
                  <span className={`px-2 py-1 rounded-lg text-sm font-medium ${restaurantItem?.open ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {restaurantItem?.open ? 'Đang mở cửa' : 'Đã đóng cửa'}
                  </span>
                </p>

                {/* Rating */}
                <p className="flex items-center gap-3 text-gray-500">
                  <Star className="text-yellow-500" />
                  <span className="text-lg font-semibold mr-5">{(restaurantItem?.rating) != null ? (restaurantItem?.rating).toFixed(1) : 2} /5</span>
                  <span><CommentIcon /> {restaurantItem?.reviewCount} lượt đánh giá</span>
                </p>

                {/* Khoảng cách & thời gian giao hàng */}
                <p className="flex items-center gap-3 text-gray-500">
                  <DeliveryDining className="text-blue-500" />
                  <span>{(restaurantItem?.distance) != null ? (restaurantItem?.distance).toFixed(1) : 2} km</span>
                  <AccessTime className="text-blue-500" />
                  <span>{(restaurantItem?.hours) != null ? (restaurantItem?.hours).toFixed(1) : 2} phút</span>
                </p>
              </div>
            </div>

          </section>
          <section className="top-0">
            <CategoryCard sections={restaurant?.categories} menuItems={menu?.menuItems} />
          </section>
          <Divider />
        </>
      )}
    </div>



  );
};

export default RestaurantPage;
