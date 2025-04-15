import { Button, Divider } from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";


import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import CartItemCard from "./CartItemCard";
import { useDispatch, useSelector } from "react-redux";
import { findCart } from "../../../state/Customer/Cart/Action";
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
    dispatch(findCart(auth?.jwt || localStorage.getItem("jwt")));
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
        jwt: localStorage.getItem("jwt"),
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

      console.log("data", data)


      dispatch(createOrder(data));
      if (data.order.isPayment == false) {
        navigate(`/payment-result/${true}`)
      }
    }
  };
  console.log("cartItems: ", cart?.cart?.cartItems)

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
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : (

        <>
          {cart?.cart?.cartItems.length > 0 ? (
            <main className="lg:flex justify-between">
              <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
                <h2 className="text-xl font-semibold mb-4 text-center">Giỏ hàng</h2>
                {cart?.cart?.cartItems.map((item, i) => (
                  <CartItemCard key={i} item={item} />
                ))}

                <Divider />
                <div className="billDetails px-5 text-sm">
                  <p className="font-semibold py-5">Chi tiết đơn hàng</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <p>Tổng giá tiền</p>
                      <p>{cart?.cart?.total.toLocaleString()} VNĐ</p>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <p>Phí vận chuyển</p>
                      <p>10,000 VNĐ</p>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <p>Thuế</p>
                      <p>1 %</p>
                    </div>

                    <Divider />
                    <div className="flex justify-between text-gray-600">
                      <p>Tổng thanh toán</p>
                      <p>{(cart?.cart?.total * 1.01 + 10000).toLocaleString()} VNĐ</p>
                    </div>
                  </div>
                </div>
              </section>
              <Divider orientation="vertical" flexItem />
              <div className="w-full h-screen max-w-lg mx-auto p-6 bg-white rounded-lg">
                <h2 className="text-xl font-semibold mb-10 mt-3 text-center">Thanh toán</h2>

                {/* Chọn địa chỉ */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Chọn Tỉnh/Thành phố</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
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

                <div className="mb-4">
                  <label className="block text-sm font-medium">Chọn Quận/Huyện</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
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

                <div className="mb-4">
                  <label className="block text-sm font-medium">Chọn Xã/Phường</label>
                  <select
                    className="mt-1 w-full p-2 border rounded-lg"
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


                <div className="mb-4">
                  <label className="block text-sm font-medium">Địa chỉ chi tiết(số nhà, tên đường,...)</label>
                  <textarea
                    className="mt-1 w-full p-2 border rounded-lg"
                    rows="1"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="Nhập địa chỉ chi tiết..."
                  />
                </div>

                {/* Chọn phương thức thanh toán */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Phương thức thanh toán</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="cash"
                        className="mr-2 accent-orange-500"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                      />
                      Tiền mặt
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="atm"
                        sx={{ color: "#FF5722" }}
                        checked={paymentMethod === "atm"}
                        onChange={() => setPaymentMethod("atm")}
                        className="mr-2 accent-orange-500"
                      />
                      Thẻ ATM
                    </label>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="mb-4">
                  <label className="block text-sm font-medium">Ghi chú cho người bán</label>
                  <textarea
                    className="mt-1 w-full p-2 border rounded-lg"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú..."
                  />
                </div>

                {/* Nút thanh toán */}
                <button onClick={handleSubmit} className="w-full bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600">
                  Thanh toán
                </button>
              </div>

            </main>
          ) : (
            <div className="flex h-[90vh] justify-center items-center">
              <div className="text-center space-y-5">
                <RemoveShoppingCartIcon sx={{ width: "10rem", height: "10rem" }} />
                <p className="font-bold text-3xl">Your Cart Is Empty</p>
              </div>
            </div>
          )}

        </>)}
    </>
  );
};

export default CartTest;
