import React, { useState, useMemo, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Box,
  CardMedia,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchRestaurantsOrder } from "../../state/Admin/Order/restaurants.order.action";

const RestaurantDashboard = () => {
  const { auth, restaurant, restaurantsOrder } = useSelector((store) => store);
  const dispatch = useDispatch();
  const orders = restaurantsOrder?.orders;

  useEffect(() => {
    dispatch(
      fetchRestaurantsOrder({
        restaurantId: restaurant?.usersRestaurant?.id,
        jwt: auth.jwt || sessionStorage.getItem("jwt"),
      })
    );
  }, [auth.jwt]);

  const accountCreatedDate = dayjs("2025-03-31T21:09:16");
  const today = dayjs();

  const generateRecentDates = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const d = today.subtract(i, "day");
      if (d.isBefore(accountCreatedDate, "day")) break;
      dates.push(d.format("DD/MM/YYYY"));
    }
    return dates.reverse();
  };

  const generateRecentMonths = () => {
    const months = [];
    for (let i = 0; i < 10; i++) {
      const d = today.subtract(i, "month");
      if (d.isBefore(accountCreatedDate, "month")) break;
      months.push(d.format("MM/YYYY"));
    }
    return months.reverse();
  };

  const generateRecentYears = () => {
    const years = [];
    for (let i = 0; i < 10; i++) {
      const d = today.subtract(i, "year");
      if (d.isBefore(accountCreatedDate, "year")) break;
      years.push(d.format("YYYY"));
    }
    return years.reverse();
  };

  const computeStatsFromOrders = (orders = []) => {
    const stats = {};

    orders.forEach((order) => {
      const date = dayjs(order.createdAt);
      const dailyKey = date.format("DD/MM/YYYY");
      const monthlyKey = date.format("MM/YYYY");
      const yearlyKey = date.format("YYYY");

      const totalQuantity = order.orderItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalRevenue = order.totalAmount;

      if (!stats[dailyKey]) stats[dailyKey] = { sales: 0, revenue: 0 };
      stats[dailyKey].sales += totalQuantity;
      stats[dailyKey].revenue += totalRevenue;

      if (!stats[monthlyKey]) stats[monthlyKey] = { sales: 0, revenue: 0 };
      stats[monthlyKey].sales += totalQuantity;
      stats[monthlyKey].revenue += totalRevenue;

      if (!stats[yearlyKey]) stats[yearlyKey] = { sales: 0, revenue: 0 };
      stats[yearlyKey].sales += totalQuantity;
      stats[yearlyKey].revenue += totalRevenue;
    });

    return stats;
  };

  const [timeframe, setTimeframe] = useState("daily");
  const [selectedValue, setSelectedValue] = useState(() =>
    generateRecentDates().slice(-1)[0]
  );

  const options = useMemo(() => {
    if (timeframe === "monthly") return generateRecentMonths();
    if (timeframe === "yearly") return generateRecentYears();
    return generateRecentDates();
  }, [timeframe]);

  const stats = useMemo(() => computeStatsFromOrders(orders), [orders]);

  const data = stats[selectedValue] || { sales: 0, revenue: 0 };

  if (!orders) return <p className="p-6">Đang tải dữ liệu đơn hàng...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Ảnh nhà hàng */}



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <Typography variant="body2" color="textSecondary">
              Tổng sản phẩm bán được
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {data.sales}
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <Typography variant="body2" color="textSecondary">
              Tổng doanh thu
            </Typography>
            <Typography variant="h5" fontWeight="bold">
              {data.revenue.toLocaleString()}₫
            </Typography>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4 space-y-2">
            <Tabs
              value={timeframe}
              onChange={(e, val) => {
                setTimeframe(val);
                const newOptions =
                  val === "daily"
                    ? generateRecentDates()
                    : val === "monthly"
                      ? generateRecentMonths()
                      : generateRecentYears();
                setSelectedValue(newOptions.slice(-1)[0]);
              }}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab value="daily" label="Ngày" />
              <Tab value="monthly" label="Tháng" />
              <Tab value="yearly" label="Năm" />
            </Tabs>

            <TextField
              select
              fullWidth
              size="small"
              label="Chọn thời gian"
              value={selectedValue}
              onChange={(e) => setSelectedValue(e.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {/* Ảnh đầu tiên chiếm toàn bộ chiều ngang */}
        <img
          className="w-full h-[40vh] object-cover col-span-1 lg:col-span-2"
          src={restaurant?.usersRestaurant?.images[0]}
          alt="Ảnh 1"
        />

        {/* Hai ảnh bên dưới chia 2 cột */}
        <img
          className="w-full h-[40vh] object-cover"
          src={restaurant?.usersRestaurant?.images[1]}
          alt="Ảnh 2"
        />
        <img
          className="w-full h-[40vh] object-cover"
          src={restaurant?.usersRestaurant?.images[2]}
          alt="Ảnh 3"
        />
      </div>
    </div>
  );
};

export default RestaurantDashboard;
