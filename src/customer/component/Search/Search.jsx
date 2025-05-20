import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Fuse from "fuse.js";
import { getAllRestaurantsDistance } from "../../../state/Customer/Restaurant/Action";
import {
  FaSearch, FaMapMarkerAlt, FaStar, FaFilter,
  FaSortAmountDown, FaSortAmountUp
} from "react-icons/fa";
import {
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Drawer,
  IconButton,
  Box,
  Typography,
  Chip,
  Button,
} from "@mui/material";

// Hàm normalize chuỗi để loại bỏ dấu tiếng Việt
const normalize = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

export default function Search() {
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector((store) => store);
  const loading = useSelector((store) => store.restaurant.loading);
  const navigate = useNavigate();
  const { query, foodSearch } = useParams();
  const [search, setSearch] = useState(foodSearch || "");

  const isLogin = auth.jwt != null || sessionStorage.getItem("jwt") != null;

  const [filters, setFilters] = useState({
    rating: 0,
    sortBy: "distance", // Default sort by distance
    sortOrder: "asc"
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Price marks for slider
  const priceMarks = [
    { value: 0, label: '0đ' },
    { value: 250000, label: '250k' },
    { value: 500000, label: '500k' },
    { value: 750000, label: '750k' },
    { value: 1000000, label: '1M' },
  ];

  // Apply filters to results
  const applyFilters = (restaurants) => {
    if (!restaurants) return [];

    return restaurants
      .filter(restaurant => {
        const rating = restaurant.rating || 0;
        return rating >= filters.rating;
      })
      .sort((a, b) => {
        const factor = filters.sortOrder === "asc" ? 1 : -1;
        if (filters.sortBy === "rating") {
          return (b.rating - a.rating) * factor;
        }
        // Default sort by distance
        return (a.distance - b.distance) * factor;
      });
  };

  useEffect(() => {
    dispatch(
      getAllRestaurantsDistance({
        address: query,
      })
    );
  }, [query]);

  // Tìm kiếm thông minh
  let filteredFoods = [];
  if (restaurant?.restaurants) {
    const options = {
      keys: ["title", "description", "foods"],
      threshold: 0.4,
      ignoreLocation: true,
      getFn: (obj, path) => {
        const value = Fuse.config.getFn(obj, path);
        if (typeof value === "string") return normalize(value);
        if (Array.isArray(value)) return value.map((v) => normalize(v));
        return "";
      },
    };

    const fuse = new Fuse(restaurant.restaurants, options);
    const normalizedSearch = normalize(search);

    if (normalizedSearch.trim() !== "") {
      filteredFoods = fuse.search(normalizedSearch).map((res) => res.item);
    } else {
      filteredFoods = restaurant.restaurants;
    }

    filteredFoods = filteredFoods.filter((r) => r?.open === true);
    filteredFoods = filteredFoods.sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
      return b.rating - a.rating;
    });

  }
  const filteredResults = applyFilters(filteredFoods);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col space-y-6">
            {/* Brand and Location */}
            <div className="flex justify-center items-center">

              <div className="mt-[30px] flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-full cursor-pointer hover:shadow-md transition-all duration-200">
                <FaMapMarkerAlt className="text-orange-500" />
                <span className="text-gray-700">
                  Giao đến <strong className="text-orange-700">{sessionStorage.getItem("address") || query}</strong>
                </span>
                <IoIosArrowDown className="text-orange-400" />
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm món ăn hoặc nhà hàng..."
                  className="w-full py-3.5 pl-12 pr-4 bg-gray-50 border-2 border-orange-100 rounded-full focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all duration-200"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
              </div>
              <Button
                variant="outlined"
                startIcon={<FaFilter />}
                onClick={() => setDrawerOpen(true)}
                sx={{
                  borderWidth: 2,
                  borderColor: '#ea580c',
                  color: '#ea580c',
                  borderRadius: '9999px',
                  px: 3,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: '#c2410c',
                    backgroundColor: '#fff7ed',
                  }
                }}
              >
                Bộ lọc
              </Button>
            </div>

            {/* Active Filters */}
            <div className="flex gap-2 flex-wrap">
              {filters.rating > 0 && (
                <Chip
                  label={`${filters.rating}+ sao`}
                  onDelete={() => setFilters(prev => ({ ...prev, rating: 0 }))}
                  sx={{
                    bgcolor: '#fff7ed',
                    color: '#ea580c',
                    '& .MuiChip-deleteIcon': {
                      color: '#ea580c',
                      '&:hover': { color: '#c2410c' }
                    }
                  }}
                />
              )}
              <Chip
                label={`Sắp xếp: ${filters.sortBy === 'distance' ? 'Khoảng cách' : 'Đánh giá'} ${filters.sortOrder === 'asc' ? '↑' : '↓'}`}
                sx={{
                  bgcolor: '#fff7ed',
                  color: '#ea580c'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: '#1e293b',
            mb: 4
          }}
        >
          Tìm thấy {filteredResults.length} kết quả
        </Typography>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-orange-100 p-4 hover:shadow-md transition-shadow">
                <Skeleton height={160} className="rounded-xl" />
                <Skeleton height={24} width="80%" className="mt-4" />
                <Skeleton height={20} width="60%" className="mt-2" />
                <Skeleton height={48} width="100%" className="mt-4" />
              </div>
            ))
          ) : (
            filteredResults.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={restaurant.images[0]}
                    alt={restaurant.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium text-orange-600 shadow-sm">
                    {restaurant.distance.toFixed(1)}km
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                    {restaurant.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                      <FaStar className="text-orange-500" />
                      <span className="font-medium text-orange-700">
                        {restaurant.rating?.toFixed(1) || "N/A"}
                      </span>
                    </span>
                    <span>•</span>
                    <span>{restaurant.reviewCount} đánh giá</span>
                    <button
                      className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
                      onClick={() => navigate(`/restaurant/${restaurant.title}/${restaurant.id}`)}
                    >
                      Đặt ngay
                    </button>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-semibold">
                      {restaurant.avgPrice?.toLocaleString()}đ/người
                    </span>
                    
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#ea580c', fontWeight: 600 }}>
            Bộ lọc tìm kiếm
          </Typography>

          {/* Rating Filter - remains the same */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Đánh giá tối thiểu</Typography>
          <Box sx={{ mb: 3 }}>
            {[5, 4, 3, 2, 1].map(star => (
              <Button
                key={star}
                variant={filters.rating === star ? "contained" : "outlined"}
                startIcon={<FaStar />}
                onClick={() => setFilters(prev => ({ ...prev, rating: star }))}
                sx={{
                  mr: 1, mb: 1,
                  ...(filters.rating === star ? {
                    bgcolor: '#ea580c',
                    '&:hover': { bgcolor: '#c2410c' }
                  } : {
                    color: '#ea580c',
                    borderColor: '#ea580c'
                  })
                }}
              >
                {star}+
              </Button>
            ))}
          </Box>

          {/* Modified Sort Options - remove price option */}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Sắp xếp theo</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              size="small"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ea580c',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#c2410c',
                }
              }}
            >
              <MenuItem value="distance">Khoảng cách</MenuItem>
              <MenuItem value="rating">Đánh giá</MenuItem>
            </Select>
          </FormControl>

          {/* Sort Order Button - remains the same */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={filters.sortOrder === "asc" ? <FaSortAmountUp /> : <FaSortAmountDown />}
            onClick={() => setFilters(prev => ({ ...prev, sortOrder: prev.sortOrder === "asc" ? "desc" : "asc" }))}
            sx={{
              color: '#ea580c',
              borderColor: '#ea580c',
              '&:hover': {
                borderColor: '#c2410c',
                backgroundColor: '#fff7ed',
              }
            }}
          >
            {filters.sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
          </Button>
        </Box>
      </Drawer>



    </div>
  );
}
