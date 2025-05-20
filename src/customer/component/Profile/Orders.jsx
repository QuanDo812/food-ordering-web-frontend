import { useEffect, useState } from "react";
import OrderCardTest from "../Order/OrderCardTest";
import { useDispatch, useSelector } from "react-redux";
import { getUsersOrders } from "../../../state/Customer/Order/Action";
import Pagination from '@mui/material/Pagination';

const Orders = () => {
  const [activeTab, setActiveTab] = useState("PAID");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Number of items per page
  const { order, auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt");

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Danh sách tab trạng thái
  const tabs = [
    { label: "Đã thanh toán", value: "PAID" },
    { label: "Đang chờ giao hàng", value: "PENDING" },
    { label: "Đang giao", value: "DELIVERING" },
    { label: "Đã giao", value: "COMPLETED" },
    { label: "Đã hủy", value: "DELETED" },
    { label: "Chờ xác nhận", value: "CONFIRMING" },
  ];

  // Reset to first page when changing tabs
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    setCurrentPage(1);
  };

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
            onClick={() => handleTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {currentOrders.length > 0 ? (
          <>
            {currentOrders.map((order, index) => (
              <div key={index} className="rounded-lg transition-all">
                {order?.orderItems?.map((item, i) => (
                  <div className="mt-4">
                    <OrderCardTest key={i} orders={order} order={item} />
                  </div>
                ))}
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#374151',
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#ef4444 !important',
                    color: 'white',
                  },
                }}
              />
            </div>
          </>
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