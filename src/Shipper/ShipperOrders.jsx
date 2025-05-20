import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllShipperOrder, updateShipperOrderStatus } from "../state/Shipper/Order/Action";
import {
    Avatar,
    AvatarGroup,
    Button,
    Card,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from "@mui/material";
import { Box } from "@mui/system";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAddress } from "../util/address";
import { useNavigate } from "react-router-dom";
// Icons cho toasts
import { CheckCircle, Info, Error } from "@mui/icons-material";

const ShipperOrders = () => {
    const { auth, shipperOrder } = useSelector((store) => store);
    const dispatch = useDispatch();
    const jwt = auth?.jwt || sessionStorage.getItem("jwt");
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllShipperOrder(jwt));
    }, [shipperOrder?.orders.length]);

    const handleUpdateOrder = (orderId) => {
        // Hiển thị thông báo đang xử lý
        const processingToast = toast.info(
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Info style={{ marginRight: '8px' }} />
                <span>Đang xử lý đơn hàng...</span>
            </div>,
            { autoClose: false, toastId: 'processing' }
        );

        dispatch(updateShipperOrderStatus(jwt, orderId))
            .then(() => {
                // Đóng toast đang xử lý
                toast.dismiss(processingToast);

                // Hiển thị thông báo thành công
                toast.success(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle style={{ marginRight: '8px' }} />
                        <span>Nhận đơn hàng thành công!</span>
                    </div>,
                    {
                        autoClose: 3000,
                        onClose: () => {
                            // Chuyển hướng sau khi thông báo đóng
                            setTimeout(() => navigate("/shipper/history"), 500);
                        }
                    }
                );
            })
            .catch((error) => {
                // Đóng toast đang xử lý
                toast.dismiss(processingToast);

                // Hiển thị thông báo lỗi
                toast.error(
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Error style={{ marginRight: '8px' }} />
                        <span>Có lỗi xảy ra khi cập nhật đơn hàng. Vui lòng thử lại.</span>
                    </div>,
                    { autoClose: 5000 }
                );
            });
    };

    // Add pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Add pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate total number of orders
    const totalOrders = shipperOrder?.orders?.length || 0;

    return (
        <div>
            {/* React-Toastify Container */}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <Box>
                <Card className="mt-1">
                    <CardHeader
                        title={"Đơn hàng của bạn"}
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
                                    <TableCell>Khách hàng</TableCell>
                                    <TableCell>Giá</TableCell>

                                    <TableCell>Tên</TableCell>
                                    <TableCell>Thành phần</TableCell>
                                    {/* <TableCell>Thời gian đặt</TableCell> */}
                                    <TableCell>Địa chỉ giao hàng</TableCell>
                                    <TableCell>Địa chỉ quán ăn</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Cập nhật</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(shipperOrder?.orders?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) || []).map((item) => (
                                    <>
                                        {item?.orderItems.map((orderItem, orderIndex) => (
                                            <TableRow
                                                key={`${item?.id}-${orderIndex}`}
                                                className="cursor-pointer"
                                                hover
                                                sx={{
                                                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                                                }}
                                            >
                                                {/* Chỉ hiển thị thông tin chung của đơn hàng ở dòng đầu tiên */}
                                                {orderIndex === 0 && (
                                                    <>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.id}
                                                        </TableCell>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            <AvatarGroup max={4} sx={{ justifyContent: "start" }}>
                                                                {item?.orderItems.map((orderItem) => (
                                                                    <Avatar
                                                                        key={orderItem?.food?.id}
                                                                        alt={orderItem?.food?.name}
                                                                        src={orderItem?.food?.images[0]}
                                                                    />
                                                                ))}
                                                            </AvatarGroup>
                                                        </TableCell>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.customer?.fullName} - SĐT: {item?.customer?.phone}
                                                        </TableCell>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.totalAmount.toLocaleString()} VNĐ
                                                        </TableCell>
                                                    </>
                                                )}

                                                {/* Hiển thị thông tin món ăn */}
                                                <TableCell>{orderItem?.food?.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {orderItem?.ingredients?.map((ingre, ingreIndex) => (
                                                            <Chip key={ingreIndex} label={ingre} />
                                                        ))}
                                                    </div>
                                                </TableCell>

                                                {/* Chỉ hiển thị địa chỉ và nút "Giao hàng" ở dòng đầu tiên */}
                                                {orderIndex === 0 && (
                                                    <>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {getAddress(item?.deliveryAddress)}
                                                        </TableCell>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.addressRestaurant}
                                                        </TableCell>
                                                        <TableCell
                                                            rowSpan={item?.orderItems.length}
                                                            sx={{ textAlign: "center" }}
                                                            className="text-white"
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="success"
                                                                size="small"
                                                                sx={{ textTransform: "capitalize" }}
                                                                onClick={() => {
                                                                    handleUpdateOrder(item?.id);
                                                                }}
                                                            >
                                                                Giao hàng
                                                            </Button>
                                                        </TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        ))}
                                    </>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Add TablePagination */}
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalOrders}
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
        </div>
    );
};

export default ShipperOrders;