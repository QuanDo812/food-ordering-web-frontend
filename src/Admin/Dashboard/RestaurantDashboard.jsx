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
import {
    Assessment,
    Restaurant,
    ShoppingCart,
    MonetizationOn
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const RestaurantDashboard = () => {
    const { auth, restaurant, restaurantsOrder, menu } = useSelector((store) => store);
    const orders = restaurantsOrder?.orders;
    const foods = menu?.menuItems;




    const accountCreatedDate = dayjs(restaurant?.usersRestaurant?.registrationDate);
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



    const totalStats = useMemo(() => {
        return {
            totalOrders: orders?.length || 0,
            totalFoods: foods?.length || 0,
            totalSales: data.sales,
            totalRevenue: data.revenue
        };
    }, [orders, foods, data]);

    // Thêm hàm để tạo dữ liệu cho biểu đồ
    const chartData = useMemo(() => {
        const data = [];
        const dates = timeframe === "daily"
            ? generateRecentDates()
            : timeframe === "monthly"
                ? generateRecentMonths()
                : generateRecentYears();

        dates.forEach(date => {
            data.push({
                name: date,
                revenue: stats[date]?.revenue || 0
            });
        });
        return data;
    }, [timeframe, stats]);

    if (!orders) return <p className="p-6">Đang tải dữ liệu đơn hàng...</p>;

    return (
        <div className="p-6 space-y-6 bg-orange-50">
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ color: '#ea580c' }}>
                Thống kê nhà hàng
            </Typography>

            {/* Time Filter - Moved to top */}
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow border-orange-600 border">
                <CardContent className="p-4">
                    <Typography variant="h6" gutterBottom sx={{ color: '#ea580c' }}>
                        Thống kế theo thời gian
                    </Typography>
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
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
                            indicatorColor="warning"
                            textColor="warning"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#ea580c',
                                },
                                '& .Mui-selected': {
                                    color: '#ea580c !important',
                                }
                            }}
                        >
                            <Tab value="daily" label="Ngày" />
                            <Tab value="monthly" label="Tháng" />
                            <Tab value="yearly" label="Năm" />
                        </Tabs>

                        <TextField
                            select
                            size="small"
                            label="Chọn thời gian"
                            value={selectedValue}
                            onChange={(e) => setSelectedValue(e.target.value)}
                            sx={{
                                minWidth: 200,
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#ea580c',
                                    },
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#ea580c',
                                }
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                    <CardContent className="p-4 border-t-4 border-orange-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="body2" color="textSecondary">
                                    Tổng đơn hàng
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#ea580c' }}>
                                    {totalStats.totalOrders}
                                </Typography>
                            </div>
                            <ShoppingCart sx={{ fontSize: 40, color: '#ea580c' }} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                    <CardContent className="p-4 border-t-4 border-orange-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="body2" color="textSecondary">
                                    Tổng món ăn
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#ea580c' }}>
                                    {totalStats.totalFoods}
                                </Typography>
                            </div>
                            <Restaurant sx={{ fontSize: 40, color: '#ea580c' }} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                    <CardContent className="p-4 border-t-4 border-orange-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="body2" color="textSecondary">
                                    Tổng sản phẩm bán được
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#ea580c' }}>
                                    {totalStats.totalSales}
                                </Typography>
                            </div>
                            <Assessment sx={{ fontSize: 40, color: '#ea580c' }} />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                    <CardContent className="p-4 border-t-4 border-orange-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="body2" color="textSecondary">
                                    Tổng doanh thu
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" sx={{ color: '#ea580c' }}>
                                    {totalStats.totalRevenue.toLocaleString()}₫
                                </Typography>
                            </div>
                            <MonetizationOn sx={{ fontSize: 40, color: '#ea580c' }} />
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Thêm biểu đồ sau phần Stats Overview */}
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="p-4">
                    <Typography variant="h6" gutterBottom sx={{ color: '#ea580c' }}>
                        Biểu đồ doanh thu theo {timeframe === "daily" ? "ngày" : timeframe === "monthly" ? "tháng" : "năm"}
                    </Typography>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="name"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tickFormatter={(value) =>
                                        new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(value)
                                    }
                                />
                                <Tooltip
                                    formatter={(value) =>
                                        new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        }).format(value)
                                    }
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Doanh thu"
                                    stroke="#ea580c"
                                    strokeWidth={2}
                                    dot={{ fill: '#ea580c' }}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default RestaurantDashboard;
