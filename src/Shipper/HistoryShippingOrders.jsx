import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getHistoryShipperOrder,
    updateOrderSuccess,
    updateShipperOrderStatus,
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
import { uploadToCloudinary } from "../Admin/utils/UploadToCloudnary";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistoryShippingOrders = () => {
    const { auth, shipperOrder } = useSelector((store) => store);
    const [open, setOpen] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [previewImage, setPreviewImage] = useState(null); // Lưu hình ảnh xem trước

    const [image, setImage] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const dispatch = useDispatch();
    const jwt = auth?.jwt || sessionStorage.getItem("jwt");

    useEffect(() => {
        dispatch(getHistoryShipperOrder(jwt));
    }, [dispatch, jwt]);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        setPreviewImage(URL.createObjectURL(file)); // Hiển thị hình ảnh xem trước
        setUploadingImage(true);
        try {
            const uploadedImage = await uploadToCloudinary(file);
            setImage(uploadedImage);
        } catch (error) {
            toast.error("Tải ảnh lên thất bại. Vui lòng thử lại!");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleRemoveOrder = (orderId) => {
        dispatch(updateShipperOrderStatus(jwt, orderId));
    }

    const handleUpdateStatus = () => {
        try {
            dispatch(updateOrderSuccess(jwt, orderId, image));
            toast.success("Cập nhật trạng thái đơn hàng thành công!");
            setOpen(false); // Đóng modal sau khi cập nhật thành công
            setImage(null);
            dispatch(getHistoryShipperOrder(jwt)); // Làm mới danh sách đơn hàng
        } catch (error) {
            toast.error("Cập nhật trạng thái thất bại. Vui lòng thử lại!");
        }
    };

    const orders = shipperOrder?.historyOrders
        ?.filter((order) => order?.orderStatus === "DELIVERING")
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

    const totalOrders = orders.length;

    return (
        <div>
            {/* ToastContainer để hiển thị thông báo */}
            <ToastContainer position="top-right" autoClose={3000} />
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
                                    <TableCell>Ghi chú</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Trạng thái</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>Giao hàng</TableCell>
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
                                                        <TableCell rowSpan={item?.orderItems.length}>
                                                            {item?.isPayment ? "Đã thanh toán" : "Chưa thanh toán"}
                                                        </TableCell>

                                                        <TableCell
                                                            rowSpan={item?.orderItems.length}
                                                            sx={{ textAlign: "center" }}
                                                            className="text-white"
                                                        >
                                                            <Button
                                                                variant="contained"
                                                                color="red"
                                                                size="small"
                                                                sx={{ textTransform: "capitalize" }}
                                                                onClick={() => {
                                                                    handleRemoveOrder(item?.id);
                                                                    toast.success("Đã bỏ giao hàng đơn hàng!");
                                                                }}
                                                            >
                                                                Bỏ giao hàng
                                                            </Button>
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
                                                                    setOpen(true);
                                                                    setOrderId(item?.id);
                                                                }}
                                                            >
                                                                Xác minh giao hàng
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

                {/* Modal để upload hình ảnh */}
                <Modal open={open} onClose={() => setOpen(false)}>
                    <Box
                        sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 400,
                            bgcolor: "white",
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                        }}
                    >
                        <div className="flex flex-col items-center gap-4">
                            {/* Hiển thị hình ảnh xem trước */}
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-full h-40 object-cover rounded-md border"
                                />
                            )}
                            <TextField
                                type="file"
                                fullWidth
                                onChange={handleImageChange}
                                inputProps={{ accept: "image/*" }}
                            />
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                className="mt-4"
                                onClick={handleUpdateStatus}
                                disabled={uploadingImage}
                            >
                                {uploadingImage ? "Đang tải ảnh..." : "Xác nhận"}
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </Box>
        </div>
    );
};

export default HistoryShippingOrders;