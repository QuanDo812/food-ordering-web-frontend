





import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItemsByFoodId } from "../../../state/Customer/Menu/Action";
import { ClipLoader } from "react-spinners";
import { categorizedIngredients } from "../../../util/categorizedIngredients";
import { addItemToCart, clearCartAction } from "../../../state/Customer/Cart/Action";
import { color, motion, transform } from "framer-motion";
import { Fullscreen } from "@mui/icons-material";



const FoodDetails = () => {

  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { foodId } = useParams()
  const { auth, cart, menu } = useSelector((store) => store)
  const [selectedImage, setSelectedImage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [cartPrice, setCartPrice] = useState(-1);
  const [showLoginModal, setShowLoginModal] = useState(false); // Thêm trạng thái cho modal đăng nhập

  const loading = useSelector((state) => state.menu.loading);

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleCheckboxChange = (itemName, itemPrice) => {
    if (selectedIngredients.includes(itemName)) {
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== itemName)

      );

      setCartPrice(cartPrice - itemPrice);
    } else {
      setSelectedIngredients([...selectedIngredients, itemName]);
      setCartPrice(cartPrice + itemPrice);
    }
  };

  const handleClickAddToCart = (e) => {
    if (!auth?.login && !localStorage.getItem("jwt")) { // Kiểm tra nếu người dùng chưa đăng nhập
      setShowLoginModal(true); // Hiển thị modal yêu cầu đăng nhập
      return;
    }
    console.log("Cart Items:", cart?.cart?.cartItems[0]?.food?.restaurant?.id);
    console.log("Current Restaurant ID:", menu?.menuItem?.restaurant?.id);
    if (cart?.cart?.cartItems.length > 0 && cart?.cart?.cartItems[0]?.food?.restaurant?.id !== menu?.menuItem?.restaurant?.id) {
      setShowPopup(true);
      console.log("setPopUp: ", showPopup)
    } else {
      handleAddItemToCart(e)
    }

  }

  const handleClickNext = (e) => {
    e.preventDefault()
    setShowPopup(false);
    dispatch(clearCartAction())
    handleAddItemToCart(e);

  };

  const handleAddItemToCart = (e) => {
    e.preventDefault()

    const data = {
      token: localStorage.getItem("jwt"),
      cartItem: {
        foodId: menu?.menuItem?.id,
        quantity: quantity,
        ingredients: selectedIngredients,
        price: cartPrice
      },
    };
    dispatch(addItemToCart(data));
  };

  useEffect(() => {
    dispatch(getMenuItemsByFoodId({ foodId }))
  }, [foodId])

  useEffect(() => {
    if (menu?.menuItem != null) {
      setSelectedImage(menu.menuItem.images[0]);
      setCartPrice(menu?.menuItem?.price)

    }

  }, [menu?.menuItem?.images])



  return (

    <>
      {loading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : (
        <>
          <Box display="flex" flexDirection="column" gap={10} p={10} width="100%" mt="30px">
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
                <Typography variant="h6" fontWeight="bold">
                  Mô tả
                </Typography>
                <Typography>
                  {menu?.menuItem?.description}
                </Typography>

                {/* Liệt kê các tùy chọn */}
                <Box mt={4}>

                  {/* Chọn topping */}
                  {menu?.menuItem?.ingredientsItems && (
                    <div className="mt-4 flex">
                      {Object.keys(
                        categorizedIngredients(menu?.menuItem?.ingredientsItems)
                      )?.map((category, index) => (
                        <div key={index} className="flex flex-col gap-3 mb-6">
                          <h3 className="text-lg font-semibold">{category}</h3>
                          <div className="space-y-2">
                            {categorizedIngredients(menu?.menuItem?.ingredientsItems)[
                              category
                            ].map((ingredient, idx) => (
                              <label key={idx} className="flex items-center w-[200px] gap-3">
                                <input
                                  type="checkbox"
                                  style={{
                                    transform: "scale(1.5)",
                                    accentColor: "#fe6d2e",
                                  }}
                                  checked={selectedIngredients.includes(ingredient?.name)}
                                  onChange={() => handleCheckboxChange(ingredient?.name, ingredient?.price)}
                                  disabled={!ingredient?.inStoke}
                                />
                                {ingredient?.name} <span className="text-gray-500">{ingredient?.price.toLocaleString() + " VNĐ"}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Box>

                {/* Chọn số lượng & nút thêm vào giỏ hàng */}
                <Box display="flex" alignItems="center" gap={2} mt={3}>
                  <Button variant="outlined" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    -
                  </Button>
                  <Typography>{quantity}</Typography>
                  <Button variant="outlined" onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </Button>
                  <button onClick={() => handleClickAddToCart()} className="bg-[#fe6d2e] hover:bg-orange-400 text-white w-[300px] h-[40px] rounded-lg">
                    Thêm vào giỏ - {(cartPrice * quantity).toLocaleString()} VNĐ
                  </button>
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

          {showLoginModal && (
            <>
              {/* Overlay mờ */}
              <div
                className="fixed inset-0 bg-black bg-opacity-20 z-[9998]"
                onClick={() => setShowLoginModal(false)}
              ></div>

              {/* Modal */}
              <motion.div
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className="fixed top-[350px] left-[580px] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-[9999] p-6 rounded-lg w-[400px] h-auto"
              >
                <div className="text-center">
                  {/* Nút đóng */}
                  <button
                    className="absolute top-3 right-3 text-gray-500 text-lg"
                    onClick={() => setShowLoginModal(false)}
                  >
                    ✖
                  </button>

                  {/* Tiêu đề */}
                  <h2 className="text-xl font-bold mt-3">Bạn cần đăng nhập</h2>
                  <p className="text-gray-500 mt-2">
                    Đăng nhập để thêm món vào giỏ hàng và tiếp tục mua sắm.
                  </p>

                  {/* Nút hành động */}
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => navigate('/account/login')}
                      className="py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="py-2 px-4 border border-gray-300 rounded hover:border-gray-400 hover:text-gray-600"
                    >
                      Để sau
                    </button>
                  </div>
                </div>
              </motion.div>

              {showPopup && (
                <>
                  {/* Overlay mờ */}
                  <div className="fixed inset-0 bg-black bg-opacity-20 z-[9999]" onClick={() => setShowPopup(false)}></div>

                  {/* Popup */}
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: "0%" }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.4 }}
                    className="fixed top-0 right-0 h-full w-150 bg-white shadow-lg z-[10000] p-4"
                  >
                    <div className="bg-white w-96 h-full p-6 overflow-y-auto">
                      {/* Nút đóng */}
                      <button className="text-gray-500 text-lg top-3 left-3 absolute" onClick={() => setShowPopup(false)}>✖</button>

                      {/* Icon giỏ hàng */}
                      <div className="flex justify-center">
                        <img src={"https://food.grab.com/static/images/ilus-confirm-new-basket.svg"} alt="Basket" className="w-80 h-80" />
                      </div>

                      {/* Nội dung popup */}
                      <h2 className="text-xl font-bold mt-3 text-center">Bắt đầu giỏ hàng mới?</h2>
                      <p className="text-gray-500 text-center mt-2">
                        Thêm món từ quán <strong>{menu?.menuItem?.restaurant?.name}</strong> sẽ xóa các món bạn đã thêm từ quán <strong>{cart?.cart?.cartItems[0]?.food?.restaurant?.name}</strong> mới giỏ hàng của bạn. Tiếp tục?
                      </p>

                      {/* Nút chọn hành động */}
                      <div className="flex absolute bottom-10 w-full">
                        <button variant="outlined" onClick={() => setShowPopup(false)} className="border hover:border-orange-500 hover:text-orange-500 py-2 rounded w-[170px]">
                          Hủy
                        </button>
                        <button
                          onClick={() => handleClickNext()}
                          className="py-2 bg-orange-500 text-white rounded w-[170px] ml-2"
                        >
                          Tiếp tục
                        </button>
                      </div>
                    </div>


                  </motion.div>
                </>
              )}
            </>
          )}

        </>
      )}</>

  );
};

export default FoodDetails;

