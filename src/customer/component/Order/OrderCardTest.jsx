import { useState } from "react";
import { FaTruck, FaCheckCircle, FaTimesCircle, FaStar } from "react-icons/fa";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createReviewFood } from "../../../state/Customer/Menu/Action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateOrderStatus } from "../../../state/Admin/Order/restaurants.order.action";
import { updateOrderStatusCustomer } from "../../../state/Customer/Order/Action";

const OrderCardTest = ({ order, orders }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const dispatch = useDispatch();

  const { auth, menu } = useSelector((store) => store)
  const jwt = sessionStorage.getItem("jwt")

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSubmitReview = () => {
    console.log("Đánh giá:", rating, "Bình luận:", comment);
    dispatch(createReviewFood(
      {
        "jwt": auth?.jwt || jwt,
        "review": {
          "comment": comment,
          "rating": rating,
          "foodId": menu?.menuItem?.id
        }
      }
    ))
    console.log("created review: ", menu?.menuItem)
    handleClose(); // Đóng modal sau khi gửi đánh giá
  };

  const handleUpdateOrder = (orderId, orderStatus) => {
    dispatch(updateOrderStatusCustomer({ orderId, orderStatus, jwt }));

  };


  const statusIcons = {
    "PENDING": <FaTruck className="text-blue-500" />,
    "PAID": <FaCheckCircle className="text-green-500" />,
    "DELETED": <FaTimesCircle className="text-red-500" />,
    "DELIVERED": <FaCheckCircle className="text-yellow-500" />,
    "CONFIRMING": <FaCheckCircle className="text-yellow-500" />,
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-5 flex flex-col lg:flex-row items-center justify-between transition-transform transform hover:scale-[1.02]">
      {/* Hình ảnh sản phẩm */}
      <div className="flex items-center space-x-4">
        <img
          src={order.food.images[0]}
          alt="product"
          className="w-24 h-24 object-cover rounded-lg"
        />
        <div>
          <h3 className="text-lg font-semibold">{order.food.name}</h3>
          <p className="text-sm text-gray-500">Thành phần: {order?.ingredients.join(", ")}</p>
          <p className="text-sm text-gray-500">{`Ngày đặt: ${orders?.createdAt.substring(0, 10)} / Thời gian đặt: ${orders?.createdAt.substring(11, 19)}`}</p>
          {orders?.orderStatus == "COMPLETED" && <p className="text-sm text-gray-500">{`Ngày giao: ${orders?.deliveredAt.substring(0, 10)} / Thời gian giao: ${orders?.deliveredAt.substring(11, 19)}`}</p>}
        </div>
      </div>

      {/* Tổng tiền */}
      <div className="text-center">
        <p className="text-xl font-bold text-red-500">{order?.totalPrice != null ? order?.totalPrice.toLocaleString() : null}₫</p>
      </div>

      {/* Trạng thái đơn hàng */}
      <div className="flex items-center space-x-2">
        {statusIcons[orders?.orderStatus]}
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${orders?.orderStatus === "PENDING"
            ? "bg-blue-100 text-blue-600"
            : orders?.orderStatus === "COMPLETED"
              ? "bg-green-100 text-green-600"
              : orders?.orderStatus === "DELIVERING"
                ? "bg-yellow-100 text-yellow-600"
                : orders?.orderStatus === "DELETED"
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
            }`}
        >
          {orders?.orderStatus}
        </span>
      </div>

      {/* Nút đánh giá nếu đơn hàng đã giao */}
      {orders?.orderStatus === "COMPLETED" && (
        <button
          onClick={handleOpen}
          className="mt-3 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          Đánh giá
        </button>
      )}

      {orders?.orderStatus === "CONFIRMING" && (
        <button
          onClick={() => handleUpdateOrder(orders?.id, "DELETED")}
          className="mt-3 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
        >
          Hủy đơn hàng
        </button>
      )}

      {/* Modal đánh giá */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Đánh giá sản phẩm</DialogTitle>
        <DialogContent>
          <div className="flex flex-col items-center">
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              size="large"
            />
            <TextField
              label="Nhận xét"
              multiline
              rows={3}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSubmitReview} color="primary" variant="contained">
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderCardTest;
