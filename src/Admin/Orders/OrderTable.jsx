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
  TablePagination
} from "@mui/material";

import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRestaurantsOrder,
  updateOrderStatus,
} from "../../state/Admin/Order/restaurants.order.action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const orderStatus = [
  { label: "Đang chờ gia hàng", value: "PENDING" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Giao hàng thất bại", value: "OUT_FOR_DELIVERY" },
  { label: "Đang giao hàng", value: "DELIVERING" },
  { label: "Đã hủy", value: "DELETED" },
  { label: "Chờ xác nhận", value: "CONFIRMING" },
];

const OrdersTable = ({ name }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt");
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
    toast.success('Cập nhật trạng thái thành công!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
  };


  // Add pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate pagination
  const emptyRows = page > 0
    ? Math.max(0, (1 + page) * rowsPerPage - (restaurantsOrder?.orders?.length || 0))
    : 0;

  return (
    <Box>
      <ToastContainer />
      <Card
        className="shadow-lg"
        sx={{
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" sx={{ color: '#ea580c', fontWeight: '600' }}>
              {name}
            </Typography>
          }
          sx={{
            p: 3,
            borderBottom: '1px solid #f1f5f9'
          }}
        />

        <TableContainer sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Id</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Hình ảnh</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Giá</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Thành phần</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Thời gian đặt</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569' }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#475569', textAlign: 'center' }}>
                  Cập nhật
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(restaurantsOrder?.orders || [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow
                    key={item?.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: '#fff7ed',
                      },
                      '&:last-child td': { border: 0 }
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
                                  ? "rgb(33, 150, 243)"
                                  : item?.orderStatus === "CONFIRMING"
                                    ? "rgb(255, 193, 7)"        // Vàng
                                    : "rgb(244, 67, 54)"        // Đỏ (default)
                        }}
                      />

                    </TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={(event) => {
                          handleUpdateStatusMenuClick(event, index);
                        }
                        }
                        sx={{
                          color: '#ea580c',
                          borderColor: '#ea580c',
                          '&:hover': {
                            borderColor: '#ea580c',
                            backgroundColor: '#fff7ed',
                          }
                        }}
                      >
                        Trạng thái
                      </Button>
                      <Menu
                        anchorEl={anchorElArray[index]}
                        open={Boolean(anchorElArray[index])}
                        onClose={() => handleUpdateStatusMenuClose(index)}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            '& .MuiMenuItem-root': {
                              px: 2,
                              py: 1,
                              '&:hover': {
                                backgroundColor: '#fff7ed',
                              }
                            }
                          }
                        }}
                      >
                        {item?.orderStatus !== "CONFIRMING" ? orderStatus.map((s) => (
                          <MenuItem
                            key={s.value}
                            onClick={() => handleUpdateOrder(item?.id, s.value, index)}
                          >
                            {s.label}
                          </MenuItem>
                        ))
                          :
                          <>
                            <MenuItem
                              key={"CONFIRM"}
                              onClick={() => handleUpdateOrder(item?.id, "PENDING", index)}
                            >
                              {"Xác nhận"}
                            </MenuItem>
                            <MenuItem
                              key={"DELETED"}
                              onClick={() => handleUpdateOrder(item?.id, "DELETED", index)}
                            >
                              {"Hủy bỏ"}
                            </MenuItem>
                          </>
                        }
                      </Menu>


                    </TableCell>


                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add TablePagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={restaurantsOrder?.orders?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-select': {
              color: '#ea580c',
            },
            '.MuiTablePagination-selectIcon': {
              color: '#ea580c',
            },
            '.MuiTablePagination-displayedRows': {
              color: '#475569',
            },
            '.MuiTablePagination-actions': {
              color: '#ea580c',
            },
          }}
          labelRowsPerPage="Số hàng mỗi trang:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} trong ${count !== -1 ? count : `hơn ${to}`}`
          }
        />
      </Card>



    </Box>
  );
};

export default OrdersTable;
