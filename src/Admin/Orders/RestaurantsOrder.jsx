import React, { useEffect } from "react";
import OrdersTable from "./OrderTable";
import {
  Card,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Box, Button, Chip } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantsOrder } from "../../state/Admin/Order/restaurants.order.action";

const orderStatus = [
  { label: "Tất cả", value: "all" },
  { label: "Đang chờ giao hàng", value: "PENDING" },
  { label: "Đang giao hàng", value: "DELIVERING" },
  { label: "Đã thanh toán", value: "PAID" },
  { label: "Hoàn thành", value: "COMPLETED" },
  { label: "Đã hủy", value: "DELETED" },
  { label: "Chờ xác nhận", value: "CONFIRMING" },


];

const RestaurantsOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const jwt = sessionStorage.getItem("jwt");
  const { restaurant, restaurantsOrder, auth } = useSelector((store) => store);

  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const filterValue = searchParams.get("order_status");

  useEffect(() => {
    dispatch(
      fetchRestaurantsOrder({
        restaurantId: restaurant?.usersRestaurant?.id,
        orderStatus: filterValue,
        jwt: auth.jwt || jwt,
      })
    );
  }, [auth.jwt, filterValue]);

  const handleFilter = (e, value) => {
    const searchParams = new URLSearchParams(location.search);

    if (value === "all") {
      searchParams.delete("order_status");
    } else searchParams.set("order_status", e.target.value);

    const query = searchParams.toString();
    navigate({ search: `?${query}` });

    console.log("restaurants orders store ", restaurantsOrder)
  };

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 to-white min-h-screen">
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 'bold',
          color: '#ea580c',
          textAlign: 'center'
        }}
      >
        Quản lý đơn hàng
      </Typography>

      <Card
        className="mb-6 shadow-lg"
        sx={{
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="p-6">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Typography
              variant="h6"
              sx={{
                color: '#ea580c',
                fontWeight: '600',
                mb: { xs: 2, md: 0 }
              }}
            >
              Lọc theo trạng thái:
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'nowrap',
                overflowX: 'auto',
                width: { xs: '100%', md: 'auto' },
                pb: 1,
                '&::-webkit-scrollbar': {
                  height: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#f0f0f0',
                  borderRadius: '6px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: '#ea580c',
                }
              }}
            >
              {orderStatus.map((item, index) => (
                <Button
                  key={index}
                  variant={filterValue === item.value || (!filterValue && item.value === 'all') ? 'contained' : 'outlined'}
                  onClick={() => {
                    const e = { target: { value: item.value } };
                    handleFilter(e, item.value);
                  }}
                  sx={{
                    mx: 0.5,
                    px: 2,
                    py: 0.75,
                    borderRadius: '20px',
                    whiteSpace: 'nowrap',
                    minWidth: 'max-content',
                    textTransform: 'none',
                    backgroundColor: filterValue === item.value || (!filterValue && item.value === 'all')
                      ? '#ea580c'
                      : 'transparent',
                    color: filterValue === item.value || (!filterValue && item.value === 'all')
                      ? 'white'
                      : '#475569',
                    borderColor: '#e5e7eb',
                    boxShadow: filterValue === item.value || (!filterValue && item.value === 'all')
                      ? '0 2px 5px rgba(234, 88, 12, 0.3)'
                      : 'none',
                    '&:hover': {
                      backgroundColor: filterValue === item.value || (!filterValue && item.value === 'all')
                        ? '#c2410c'
                        : '#fff7ed',
                      borderColor: '#ea580c',
                    }
                  }}
                >
                  {item.label}

                  {/* <Chip
                    size="small"
                    color="warning"
                    label={restaurantsOrder?.orders.length || 0}
                    sx={{ ml: 1, height: '20px', minWidth: '20px' }}
                  /> */}

                </Button>
              ))}
            </Box>
          </Box>
        </div>
      </Card>

      <OrdersTable name="Danh sách đơn hàng" />
    </div>
  );
};

export default RestaurantsOrder;
