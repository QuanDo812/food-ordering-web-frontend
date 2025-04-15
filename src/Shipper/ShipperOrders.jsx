import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllShipperOrder, updateShipperOrderStatus } from "../state/Shipper/Order/Action";
import { Avatar, AvatarGroup, Button, Card, CardHeader, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Box } from "@mui/system";
import { getAddress } from "../util/address";
import { useNavigate } from "react-router-dom";

const ShipperOrders = () => {
    const { auth, shipperOrder } = useSelector((store) => store);
    const dispatch = useDispatch();
    const jwt = auth?.jwt || localStorage.getItem("jwt");
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getAllShipperOrder(jwt));
    }, [shipperOrder?.orders.length]);

    const handleUpdateOrder = (orderId) => {
        dispatch(updateShipperOrderStatus(jwt, orderId));
        navigate("/shipper/history");
    }




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
                                    {/* <TableCell>Thời gian đặt</TableCell> */}
                                    <TableCell>Địa chỉ giao hàng</TableCell>
                                    <TableCell>Địa chỉ quán ăn</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Cập nhật</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(shipperOrder?.orders || []).map((item) => (
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
                </Card>



            </Box>
        </div>
    );
};

export default ShipperOrders;