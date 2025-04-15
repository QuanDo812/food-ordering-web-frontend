





import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMenuItemsByFoodId } from "../../../state/Customer/Menu/Action";
import { ClipLoader } from "react-spinners";


const FoodDetails = () => {

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()
  const { foodId } = useParams()
  const { auth, menu } = useSelector((store) => store)
  const [selectedImage, setSelectedImage] = useState("");
  const loading = useSelector((state) => state.menu.loading);
  console.log("menu: ", menu?.menuItem)



  useEffect(() => {
    dispatch(getMenuItemsByFoodId({ foodId, jwt: auth.jwt || localStorage.getItem("jwt") }))
  }, [foodId])

  useEffect(() => {
    if (menu?.menuItem != null) {
      setSelectedImage(menu.menuItem.images[0]);
    }

  }, [menu?.menuItem?.images])



  return (

    <>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : (
        <Box display="flex" flexDirection="column" gap={10} p={10} maxWidth={1200} mt="30px">
          {/* Khu vực hình ảnh + thông tin */}
          <Box display="flex" gap={20}>
            {/* Hình ảnh bên trái */}
            <Box>
              <Box
                component="img"
                src={selectedImage}
                alt="food"
                sx={{
                  width: 400,
                  height: 300,
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />

              {/* Thumbnail nhỏ bên dưới */}
              <Box display="flex" gap={1} mt={2} justifyContent="center">
                {menu?.menuItem?.images.map((img, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={img}
                    alt="thumbnail"
                    sx={{
                      width: 70,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 1,
                      cursor: "pointer",
                      border: selectedImage === img ? "3px solid green" : "2px solid transparent",
                      transition: "all 0.3s",
                      "&:hover": { opacity: 0.7 },
                    }}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </Box>
            </Box>

            {/* Thông tin bên phải */}
            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold">
                {menu?.menuItem?.name}
              </Typography>
              <Typography variant="h6" color="green" mt={1}>
                {menu?.menuItem?.price} VNĐ
              </Typography>
              <Rating value={menu?.menuItem?.rating != null ? (menu?.menuItem?.rating).toFixed(1) : 3.3} precision={0.5} readOnly sx={{ mt: 1 }} />
              <Typography mt={2}>
                {menu?.menuItem?.description}
              </Typography>

              {/* Chọn số lượng & nút thêm vào giỏ hàng */}
              <Box display="flex" alignItems="center" gap={2} mt={3}>
                <Button variant="outlined" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  -
                </Button>
                <Typography>{quantity}</Typography>
                <Button variant="outlined" onClick={() => setQuantity((q) => q + 1)}>
                  +
                </Button>
                <Button variant="contained" color="success" sx={{ ml: 2 }}>
                  Add to Cart
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Bình luận & Đánh giá */}
          <Box>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              📝 Đánh giá từ khách hàng
            </Typography>
            {menu?.menuItem?.reviews.length > 0 ?
              menu?.menuItem?.reviews.map((review, index) => (
                <Box key={index} p={2} borderBottom="1px solid #ddd">
                  <Box>
                    <Typography fontWeight="bold">{review.nameCustomer}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {`Ngày: ${review?.reviewDate.substring(0, 10)} / ${review?.reviewDate.substring(11, 19)}`}
                    </Typography>
                  </Box>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography>{review.comment}</Typography>
                </Box>
              ))
              :
              <Box>
                <Typography sx={{ ml: "30px", mt: "30px" }}>Chưa có bình luận nào</Typography>
              </Box>

            }
          </Box>
        </Box>
      )}</>

  );
};

export default FoodDetails;

