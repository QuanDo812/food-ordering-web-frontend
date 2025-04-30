import { useState } from "react";
import { color, motion, transform } from "framer-motion";
import { Divider } from "@mui/material";
import { Button } from "react-scroll";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, clearCartAction } from "../../../state/Customer/Cart/Action";
import { categorizedIngredients } from "../../../util/categorizedIngredients"





const MenuDetail = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [cartPrice, setCartPrice] = useState(food?.price);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Thêm trạng thái cho modal đăng nhập


  const { auth, cart } = useSelector((store) => store)

  const dispatch = useDispatch();
  const navigate = useNavigate()



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

  const handleViewDetails = () => {
    navigate(`/food/foodDetails/${food?.id}`)
  }

  const handleClickAddToCart = (e) => {
    if (!auth?.login && !sessionStorage.getItem("jwt")) { // Kiểm tra nếu người dùng chưa đăng nhập
      setShowLoginModal(true); // Hiển thị modal yêu cầu đăng nhập
      return;
    }
    if (cart?.cart?.cartItems.length > 0 && cart?.cart?.cartItems[0]?.food?.restaurant?.id !== food?.restaurant?.id) {
      setShowPopup(true);
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
      token: sessionStorage.getItem("jwt"),
      cartItem: {
        foodId: food?.id,
        quantity: quantity,
        ingredients: selectedIngredients,
        price: cartPrice
      },
    };
    dispatch(addItemToCart(data));
    onClose();
  };




  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-20 z-[9998]" onClick={onClose}></div>
      <motion.div
        initial={{ x: "100%" }} // Bắt đầu từ ngoài màn hình bên phải
        animate={{ x: "0%" }}   // Trượt vào vị trí hiện tại
        exit={{ x: "100%" }}     // Trượt ra khi đóng
        transition={{ type: "tween", duration: 0.4 }} // Hiệu ứng mượt
        className="fixed top-0 right-0 h-full w-150 bg-white shadow-lg z-[9999] p-4"
      >


        <div className="bg-white w-96 h-full p-6 overflow-y-auto">
          <button className="text-gray-500 text-lg top-3 left-3 absolute" onClick={onClose}>✖</button>
          <img src={food?.images[0]} alt={food?.name} className="w-full h-40 object-cover rounded-lg" />
          <h2 className="text-xl font-bold mt-3">{food?.name}</h2>
          <p className="text-gray-500">{food?.description}</p>


          {/* Chọn topping */}
          <div className="mt-4 flex flex-col gap-3">
            {Object.keys(
              categorizedIngredients(food?.ingredientsItems)
            )?.map((category, index) => (
              <div key={index} className="flex flex-col gap-3 mb-6">
                <h3 className="text-lg font-semibold">{category}</h3>
                <div className="space-y-2">
                  {categorizedIngredients(food?.ingredientsItems)[
                    category
                  ].map((ingredient, idx) => (
                    <label key={idx} className="flex items-center gap-3">
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


          {/* Nhập ghi chú */}
          <textarea className="w-full mt-3 p-2 border rounded" placeholder="Ghi chú (không bắt buộc)" />

          {/* Chọn số lượng */}
          <div className="flex items-center justify-center mt-4 space-x-20">

            <RemoveCircle className="text-orange-500 cursor-pointer" style={{ "fontSize": "35px" }} onClick={() => setQuantity(Math.max(1, quantity - 1))} />
            <span className="text-lg font-bold text-orange-500">{quantity}</span>
            <AddCircle className="text-orange-500 cursor-pointer" style={{ "fontSize": "35px" }} onClick={() => setQuantity(quantity + 1)} />
          </div>

          <Button
            onClick={handleViewDetails}
            variant="outlined"
            className="mt-[140px] w-full h-[50px] rounded-lg border-2 border-orange-500 text-orange-500">
            Xem chi tiết món ăn
          </Button>

          {/* Nút thêm vào giỏ hàng */}
          <button onClick={handleClickAddToCart} className="bg-[#fe6d2e] hover:bg-orange-400 text-white w-full h-[50px] mt-[15px] rounded-lg">
            Thêm vào giỏ - {(cartPrice * quantity).toLocaleString()} VNĐ
          </button>
        </div>
        {showPopup && (
          <>
            {/* Overlay mờ */}
            <div className="fixed inset-0 bg-black bg-opacity-20 z-[9998]" onClick={() => setShowPopup(false)}></div>

            {/* Popup */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className="fixed top-0 right-0 h-full w-150 bg-white shadow-lg z-[9999] p-4"
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
                  Thêm món từ quán <strong>{food?.restaurant?.name}</strong> sẽ xóa các món bạn đã thêm từ quán <strong>{cart?.cart?.cartItems[0]?.food?.restaurant?.name}</strong> mới giỏ hàng của bạn. Tiếp tục?
                </p>

                {/* Nút chọn hành động */}
                <div className="flex absolute bottom-10 w-full">
                  <button variant="outlined" onClick={() => setShowPopup(false)} className="border hover:border-orange-500 hover:text-orange-500 py-2 rounded w-[170px]">
                    Hủy
                  </button>
                  <button
                    onClick={handleClickNext}
                    className="py-2 bg-orange-500 text-white rounded w-[170px] ml-2"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>


            </motion.div>
          </>
        )}

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

      </motion.div>
    </>

  );
};

export default MenuDetail;
