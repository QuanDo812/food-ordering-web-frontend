import { Button, Divider } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";


import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CartItemCard from "./CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import { clearCartAction, findCart } from "../../../state/Customer/Cart/Action";
import { createOrder } from "../../../state/Customer/Order/Action";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};


const CartTest = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { cart, auth } = useSelector((store) => store)


  useEffect(() => {
    dispatch(findCart(auth?.jwt || sessionStorage.getItem("jwt")));
  }, [cart.cartItems]);






  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [detailAddress, setDetailAddress] = useState("")

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [note, setNote] = useState("");



  const handleSubmit = () => {
    if (selectedDistrict !== "" && selectedProvince !== "" && selectedWard !== "") {
      const provinceName = provinces.find(p => p.code == selectedProvince)?.name || "";
      const districtName = districts.find(d => d.code == selectedDistrict)?.name || "";
      const wardName = wards.find(w => w.code == selectedWard)?.name || "";
      const data = {
        jwt: sessionStorage.getItem("jwt"),
        order: {
          restaurantId: cart?.cart?.cartItems[0].food?.restaurant?.id,
          deliveryAddress: {
            fullName: auth.user?.fullName,
            detailAddress: detailAddress,
            ward: wardName,
            district: districtName,
            province: provinceName,


          },
          note: note,
          isPayment: paymentMethod == "atm" ? true : false
        },
      };


      dispatch(createOrder(data));
      if (data.order.isPayment == false) {
        navigate(`/payment-result/${true}`)
      }
    }
  };

  // Lấy danh sách tỉnh/thành phố
  useEffect(() => {
    axios.get("https://provinces.open-api.vn/api/?depth=1").then((res) => {
      setProvinces(res.data);
    });
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (selectedProvince) {
      axios.get(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`).then((res) => {
        setDistricts(res.data.districts);
        setWards([]);
        setSelectedDistrict("");
        setSelectedWard("");
      });
    }
  }, [selectedProvince]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      axios.get(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`).then((res) => {
        setWards(res.data.wards);
        setSelectedWard("");
      });
    }
  }, [selectedDistrict]);


  return (
    <>
      {cart?.cart?.cartItems == undefined ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#ea580c" size={60} />
        </div>
      ) : (
        <>
          {cart?.cart?.cartItems.length > 0 ? (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <main className="lg:flex lg:space-x-8">
                  {/* Cart Section */}
                  <section className="lg:w-[35%] bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      Giỏ hàng của bạn
                    </h2>
                    <div className="space-y-6">
                      {cart?.cart?.cartItems.map((item, i) => (
                        <CartItemCard key={i} item={item} />
                      ))}
                    </div>

                    <Divider sx={{ my: 4 }} />

                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-800">Chi tiết thanh toán</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Tổng giá tiền</span>
                          <span className="font-medium">{cart?.cart?.total.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Phí vận chuyển</span>
                          <span className="font-medium">10,000 VNĐ</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Thuế</span>
                          <span className="font-medium">1%</span>
                        </div>
                        <Divider />
                        <div className="flex justify-between text-lg font-semibold text-orange-600">
                          <span>Tổng thanh toán</span>
                          <span>{(cart?.cart?.total * 1.01 + 10000).toLocaleString()} VNĐ</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Checkout Form */}
                  <section className="lg:w-[65%] mt-8 lg:mt-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-8">
                        Thông tin thanh toán
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Address Selection */}
                        <div className="md:col-span-2 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tỉnh/Thành phố
                              </label>
                              <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                              >
                                <option value="">Chọn tỉnh/thành phố</option>
                                {provinces.map((province) => (
                                  <option key={province.code} value={province.code}>
                                    {province.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quận/Huyện
                              </label>
                              <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedProvince}
                              >
                                <option value="">Chọn quận/huyện</option>
                                {districts.map((district) => (
                                  <option key={district.code} value={district.code}>
                                    {district.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Xã/Phường
                              </label>
                              <select
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                                value={selectedWard}
                                onChange={(e) => setSelectedWard(e.target.value)}
                                disabled={!selectedDistrict}
                              >
                                <option value="">Chọn xã/phường</option>
                                {wards.map((ward) => (
                                  <option key={ward.code} value={ward.code}>
                                    {ward.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Địa chỉ chi tiết
                            </label>
                            <textarea
                              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                              rows="2"
                              value={detailAddress}
                              onChange={(e) => setDetailAddress(e.target.value)}
                              placeholder="Số nhà, tên đường..."
                            />
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Phương thức thanh toán
                          </label>
                          <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-200">
                              <input
                                type="radio"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={() => setPaymentMethod("cash")}
                                className="w-4 h-4 accent-orange-500"
                              />
                              <span className="ml-2">Tiền mặt</span>
                            </label>
                            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-200">
                              <input
                                type="radio"
                                value="atm"
                                checked={paymentMethod === "atm"}
                                onChange={() => setPaymentMethod("atm")}
                                className="w-4 h-4 accent-orange-500"
                              />
                              <span className="ml-2">Thẻ ATM</span>
                            </label>
                          </div>
                        </div>

                        {/* Note */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                          </label>
                          <textarea
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                            rows="3"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Ghi chú cho người bán..."
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSubmit}
                        className="w-full mt-8 bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                      >
                        Thanh toán
                      </button>
                    </div>
                  </section>
                </main>
              </div>
            </div>
          ) : (
            <div className="flex h-[90vh] justify-center items-center bg-gradient-to-br from-orange-50 to-white">
              <div className="text-center space-y-6">
                <RemoveShoppingCartIcon sx={{ width: "8rem", height: "8rem", color: '#ea580c' }} />
                <p className="font-bold text-2xl text-gray-800">Giỏ hàng trống</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CartTest;
