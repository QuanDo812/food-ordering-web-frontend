// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getUsersOrders } from '../../state/Customer/Order/Action';
// import OrderCard from '../Order/OrderCard';
// import OrderCardTest from '../Order/OrderCardTest';

// const Orders = () => {
//   const {order,auth}=useSelector(store=>store);
//   const dispatch=useDispatch();
//   const jwt=localStorage.getItem("jwt")

//   useEffect(()=>{
//     dispatch(getUsersOrders(jwt))
//   },[auth.jwt])
//   return (
//     <div className='flex items-center flex-col'>
//       <h1 className='text-xl text-center py-7 font-semibold'>My Orders</h1>
//       <div className='space-y-5 w-full lg:w-1/2'>
//      { order?.orders?.map((order)=>order?.orderItems.map((item)=><OrderCardTest status={order?.orderStatus} order={item}/>))}
//     </div>
//     </div>
//   )
// }

// export default Orders

import { useEffect, useState } from "react";
import OrderCardTest from "../Order/OrderCardTest";
import { useDispatch, useSelector } from "react-redux";
import { getUsersOrders } from "../../../state/Customer/Order/Action";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("PAID");
  const { order, auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    dispatch(getUsersOrders(auth?.jwt || jwt));
  }, [auth.jwt]);

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = order?.orders?.filter(
    (order) => {
      if (activeTab === "PAID") return order?.isPayment;
      return order?.orderStatus === activeTab
    }
  ) || [];

  // Danh sách tab trạng thái
  const tabs = [
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đang chờ giao hàng", value: "PENDING" },
    { label: "Đang giao", value: "DELIVERING" },
    { label: "Đã giao", value: "COMPLETED" },
    { label: "Đã hủy", value: "DELETED" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl">
      <h2 className="text-2xl font-bold mb-5 text-center">🛒 Đơn hàng của bạn</h2>

      {/* Tabs chuyển đổi trạng thái */}
      <div className="flex justify-center space-x-4 border-b pb-3 mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-2 px-4 text-sm font-semibold transition-all duration-300 
              ${activeTab === tab.value
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500 hover:text-red-500"
              }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div
              key={index}
              className="rounded-lg transition-all"
            >
              {order?.orderItems?.map((item, i) => (
                <div className="mt-4">
                  <OrderCardTest key={i} orders={order} order={item} />
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">😢 Không có đơn hàng nào.</p>
            <p className="text-sm">Bạn chưa có đơn hàng nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;


