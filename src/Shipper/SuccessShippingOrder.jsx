import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getHistoryShipperOrder,
} from "../state/Shipper/Order/Action";
import {
    Avatar,
    AvatarGroup,
    Button,
    Card,
    CardHeader,
    Chip,
    Modal,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
    TablePagination
} from "@mui/material";
import { Box } from "@mui/system";
import { getAddress } from "../util/address";
import { Image } from "@mui/icons-material";

const SuccessShippingOrder = () => {
    const { auth, shipperOrder } = useSelector((store) => store);
    const dispatch = useDispatch();
    const jwt = auth?.jwt || sessionStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getHistoryShipperOrder(jwt));
    }, [dispatch, jwt]);

    const orders = shipperOrder?.historyOrders
        ?.filter((order) => order?.orderStatus === "COMPLETED")
        ?.sort((a, b) => new Date(b?.deliveredAt) - new Date(a?.deliveredAt)) || [];

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

    // Calculate total orders
    const totalOrders = orders.length;

    return (
        <div>
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
                                    <TableCell>Địa chỉ giao hàng</TableCell>
                                    <TableCell>Địa chỉ quán ăn</TableCell>

                                    <TableCell sx={{ textAlign: "center" }}>Thời gian giao hàng</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Hình ảnh giao hàng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((item) => (
                                    <>
                                        {item?.orderItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((orderItem, orderIndex) => (
                                            <TableRow
                                                key={`${item?.id}-${orderIndex}`}
                                                className="cursor-pointer"
                                                hover
                                                sx={{
                                                    "&:last-of-type td, &:last-of-type th": { border: 0 },
                                                }}
                                            >
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
                                                            {item?.customer?.fullName} - SĐT:{" "}
                                                            {item?.customer?.phone}
                                                        </TableCell>
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.totalAmount.toLocaleString()} VNĐ
                                                        </TableCell>
                                                    </>
                                                )}

                                                <TableCell>{orderItem?.food?.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {orderItem?.ingredients?.map((ingre, ingreIndex) => (
                                                            <Chip key={ingreIndex} label={ingre} />
                                                        ))}
                                                    </div>
                                                </TableCell>

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
                                                        >
                                                            {item?.deliveredAt}
                                                        </TableCell>
                                                        <TableCell
                                                            rowSpan={item?.orderItems.length}
                                                            sx={{ textAlign: "center" }}
                                                        >
                                                            <img className="w-[300px] h-auto" src={item?.imageDelivery} alt="delivery" />
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

export default SuccessShippingOrder;