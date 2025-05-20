





import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItemsByFoodId, getMenuItemsByRestaurantId } from "../../../state/Customer/Menu/Action";
import { ClipLoader } from "react-spinners";
import { categorizedIngredients } from "../../../util/categorizedIngredients";
import { addItemToCart, clearCartAction } from "../../../state/Customer/Cart/Action";
import { color, motion, transform } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




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
    if (!auth?.login && !sessionStorage.getItem("jwt")) { // Kiểm tra nếu người dùng chưa đăng nhập
      setShowLoginModal(true); // Hiển thị modal yêu cầu đăng nhập
      return;
    }

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
      token: auth?.jwt || sessionStorage.getItem("jwt"),
      cartItem: {
        foodId: menu?.menuItem?.id,
        quantity: quantity,
        ingredients: selectedIngredients,
        price: cartPrice
      },
    };
    dispatch(addItemToCart(data));
    toast.success('Đã thêm món ăn vào giỏ hàng!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",


    });
  };

  useEffect(() => {
    dispatch(getMenuItemsByFoodId({ foodId }))
    dispatch(
      getMenuItemsByRestaurantId({
        restaurantId: menu?.menuItem?.restaurant?.id
      })
    );
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

        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 100000 }}
          />
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Main Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Images */}
                <div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={selectedImage}
                      alt={menu?.menuItem?.name}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <Rating
                        value={menu?.menuItem?.rating || 3.3}
                        precision={0.5}
                        readOnly
                        size="small"
                      />
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {menu?.menuItem?.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="thumbnail"
                        className={`w-20 h-20 rounded-lg cursor-pointer object-cover transition-all
                          ${selectedImage === img ? 'ring-2 ring-orange-500' : 'opacity-70 hover:opacity-100'}`}
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    {menu?.menuItem?.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-bold text-orange-600">
                      {menu?.menuItem?.price.toLocaleString()} VNĐ
                    </span>
                    <div className="bg-orange-100 px-3 py-1 rounded-full">
                      <Typography variant="body2" color="orange.800">
                        ⭐ {menu?.menuItem?.rating?.toFixed(1)} ({menu?.menuItem?.reviews.length} đánh giá)
                      </Typography>
                    </div>
                  </div>

                  <div className="prose max-w-none mb-8">
                    <h3 className="text-lg font-semibold text-gray-700">Mô tả</h3>
                    <p className="text-gray-600">{menu?.menuItem?.description}</p>
                  </div>

                  {/* Ingredients Selection */}
                  {menu?.menuItem?.ingredientsItems && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">
                        Tùy chọn thêm
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(categorizedIngredients(menu?.menuItem?.ingredientsItems))
                          .map(([category, items]) => (
                            <div key={category} className="space-y-3">
                              <h4 className="font-medium text-gray-700">{category}</h4>
                              <div className="space-y-2">
                                {items.map((ingredient, idx) => (
                                  <label
                                    key={idx}
                                    className={`flex items-center justify-between p-3 rounded-lg border
                                      ${selectedIngredients.includes(ingredient?.name)
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-200'
                                      } ${!ingredient?.inStoke && 'opacity-50'}`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-orange-500"
                                        checked={selectedIngredients.includes(ingredient?.name)}
                                        onChange={() => handleCheckboxChange(ingredient?.name, ingredient?.price)}
                                        disabled={!ingredient?.inStoke}
                                      />
                                      <span className="text-gray-700">{ingredient?.name}</span>
                                    </div>
                                    <span className="text-orange-600 font-medium">
                                      {ingredient?.price ? ingredient.price.toLocaleString() + " VNĐ" : "0 VNĐ"}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity and Add to Cart */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-full">
                      <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-l-full"
                      >
                        -
                      </button>
                      <span className="px-4 font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="px-4 py-2 text-orange-500 hover:bg-orange-50 rounded-r-full"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleClickAddToCart}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-full font-medium transition-colors"
                    >
                      Thêm vào giỏ - {(cartPrice * quantity).toLocaleString()} VNĐ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Dishes */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Món ăn khác tại {menu?.menuItem?.restaurant?.name}
              </h2>

              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                className="pb-12"
              >
                {menu?.menuItems
                  ?.filter(item => item.id !== menu?.menuItem?.id)
                  .map((item) => (
                    <SwiperSlide key={item.id}>
                      <div
                        className="bg-white rounded-xl shadow-sm border border-orange-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/food/foodDetails/${item.id}`)}
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-orange-600 font-medium">
                              {item.price.toLocaleString()} VNĐ
                            </span>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-orange-400" size={14} />
                              <span className="text-sm text-gray-600">
                                {item.rating?.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>Đánh giá từ khách hàng</span>
                <span className="text-sm font-normal text-gray-500">
                  ({menu?.menuItem?.reviews.length} đánh giá)
                </span>
              </h2>

              {menu?.menuItem?.reviews.length > 0 ? (
                <div className="space-y-6">
                  {menu?.menuItem?.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {review.nameCustomer}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {review?.reviewDate.substring(0, 10)}
                        </span>
                      </div>
                      <Rating value={review.rating} readOnly size="small" />
                      <p className="mt-2 text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Chưa có đánh giá nào
                </div>
              )}
            </div>
          </div>

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


            </>
          )}
          {showPopup && (
            <>
              {/* Overlay mờ */}
              <div className="fixed inset-0 bg-black bg-opacity-20 z-[10001]" onClick={() => setShowPopup(false)}></div>

              {/* Popup */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className="fixed top-0 right-0 h-full w-150 bg-white shadow-lg z-[10002] p-4"
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
                      onClick={(e) => handleClickNext(e)}
                      className="py-2 bg-orange-500 text-white rounded w-[170px] ml-2"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </div>


              </motion.div>
            </>
          )}

        </div>
      )}</>

  );
};

export default FoodDetails;

