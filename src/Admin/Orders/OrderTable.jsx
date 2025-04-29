import {
  Avatar,
  AvatarGroup,
  Backdrop,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantsOrder,
  updateOrderStatus,
} from "../../state/Admin/Order/restaurants.order.action";
// import {
//   confirmOrder,
//   deleteOrder,
//   deliveredOrder,
//   getOrders,
//   shipOrder,
// } from "../../state/Admin/Order/Action";

const orderStatus = [
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Out For Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Delivering", value: "DELIVERING" },
];

const OrdersTable = ({ name }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const { auth, restaurant, restaurantsOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const { id } = useParams();

  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };

  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };


  const handleUpdateOrder = (orderId, orderStatus, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(updateOrderStatus({ orderId, orderStatus, jwt }));
  };

  console.log("restaurants orders store ", restaurantsOrder)

  return (
    <Box>
      <Card className="mt-1">
        <CardHeader
          title={name}
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <TableContainer>
          <Table sx={{}} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Hình ảnh</TableCell>
                {/* {!isDashboard && <TableCell>Title</TableCell>} */}
                <TableCell>Khách hàng</TableCell>
                <TableCell>Giá</TableCell>

                <TableCell>Tên</TableCell>
                <TableCell>Thành phần</TableCell>
                <TableCell>Thời gian đặt</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Cập nhật</TableCell>
                {/* {!isDashboard && (
                  <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
                )} */}
              </TableRow>
            </TableHead>
            <TableBody>
              {(restaurantsOrder?.orders || [])
                ?.slice(0, restaurantsOrder?.orders.length)
                .map((item, index) => (
                  <TableRow
                    className="cursor-pointer"
                    hover
                    key={item?.id}
                    sx={{
                      "&:last-of-type td, &:last-of-type th": { border: 0 },
                    }}
                  >
                    <TableCell>{item?.id}</TableCell>
                    <TableCell sx={{}}>
                      <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                        {item?.orderItems.map((orderItem) => (
                          <Avatar
                            alt={orderItem?.food?.name}
                            src={orderItem?.food?.images[0]}
                          />
                        ))}
                      </AvatarGroup>{" "}
                    </TableCell>

                    <TableCell sx={{}}>
                      {item?.customer?.email}
                    </TableCell>

                    <TableCell>{item?.totalAmount.toLocaleString()} VNĐ</TableCell>

                    <TableCell className="">
                      {item?.orderItems.map((orderItem) => (
                        <p>
                          {orderItem?.food?.name}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell className="space-y-2">
                      {item?.orderItems.map((orderItem) =>
                        <div className="flex gap-1 flex-wrap">
                          {orderItem?.ingredients?.map((ingre) => (
                            <Chip label={ingre} />
                          ))}
                        </div>

                      )}
                    </TableCell>
                    <TableCell>{item?.createdAt}</TableCell>
                    <TableCell className="text-white">
                      <Chip
                        label={item?.orderStatus}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "white",
                          backgroundColor:
                            item?.orderStatus === "PENDING"
                              ? "rgb(255, 193, 7)"        // Vàng
                              : item?.orderStatus === "COMPLETED"
                                ? "rgb(76, 175, 80)"        // Xanh lá
                                : item?.orderStatus === "DELIVERING"
                                  ? "rgb(33, 150, 243)"       // Xanh dương
                                  : "rgb(244, 67, 54)"        // Đỏ (default)
                        }}
                      />

                    </TableCell>

                    <TableCell
                      sx={{ textAlign: "center" }}
                      className="text-white"
                    >
                      <div>
                        <Button
                          id={`basic-button-${item?.id}`}
                          aria-controls={`basic-menu-${item?.id}`}
                          aria-haspopup="true"
                          aria-expanded={Boolean(anchorElArray[index])}
                          onClick={(event) =>
                            handleUpdateStatusMenuClick(event, index)
                          }
                        >
                          Trạng thái
                        </Button>
                        <Menu
                          id={`basic-menu-${item?.id}`}
                          anchorEl={anchorElArray[index]}
                          open={Boolean(anchorElArray[index])}
                          onClose={() => handleUpdateStatusMenuClose(index)}
                          MenuListProps={{
                            "aria-labelledby": `basic-button-${item?.id}`,
                          }}
                        >
                          {orderStatus.map((s) => (
                            <MenuItem
                              onClick={() =>
                                handleUpdateOrder(item?.id, s.value, index)
                              }
                            >
                              {s.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </TableCell>


                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>



    </Box>
  );
};

export default OrdersTable;
