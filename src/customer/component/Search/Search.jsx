import { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Fuse from "fuse.js";
import { getAllRestaurantsDistance } from "../../../state/Customer/Restaurant/Action";

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

  const isLogin = auth.jwt != null || localStorage.getItem("jwt") != null;

  useEffect(() => {
    if (isLogin) {
      dispatch(
        getAllRestaurantsDistance({
          jwt: auth?.jwt || localStorage.getItem("jwt"),
          address: query,
        })
      );
    }
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

  return (
    <div>
      {/* Header */}
      <div className="w-full bg-white py-4 px-6 shadow-md mt-7">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold text-orange-500">Foodie</h1>

          {/* Delivery Address */}
          <div className="flex items-center mt-3 bg-gray-100 px-4 py-2 rounded-full cursor-pointer">
            <FaMapMarkerAlt className="text-red-500 mr-2" />
            <span>
              Giao đến{" "}
              <strong>{localStorage.getItem("address") || query}</strong>
            </span>
            <IoIosArrowDown className="ml-2 text-gray-500" />
          </div>

          {/* Search Bar */}
          <div className="relative w-full mt-4">
            <input
              type="text"
              placeholder="Tìm món hoặc quán ăn"
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-full focus:outline-none focus:border-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-3 text-gray-500" />
          </div>

          {/* Category Suggestions */}
          <div className="mt-6 mb-6 flex gap-4 overflow-x-auto">
            {[
              "Gần tôi",
              "🔥 Vùng Deal Siêu Đậm",
              "Quán mở xuyên đêm",
              "Quán ngon đặc tuyến",
              "Đặt Đồng Giảm Đậm",
              "Best Seller Giảm 50%",
            ].map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 h-20 bg-orange-100 rounded-lg flex items-center text-center justify-center text-orange-600 font-semibold cursor-pointer hover:bg-orange-200"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h2 className="mt-5 ml-5 text-2xl font-bold">
          Các quán có thể bạn đang tìm kiếm tại{" "}
          <span className="text-orange-500">
            {localStorage.getItem("address") || query}
          </span>
        </h2>
      </div>

      {/* Loading or Results */}
      <div className="px-10 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="bg-white shadow-lg rounded-lg p-4">
              <Skeleton height={160} />
              <Skeleton height={20} width="80%" className="mt-2" />
              <Skeleton height={15} width="60%" className="mt-1" />
              <Skeleton height={40} width="100%" className="mt-3" />
            </div>
          ))
        ) : (
          filteredFoods?.map((restaurant) => (
            <div
              key={restaurant.id}
              className="cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src={restaurant.images[0]}
                alt={restaurant.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {restaurant?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  ⭐{" "}
                  {restaurant?.rating != null
                    ? restaurant?.rating.toFixed(1)
                    : 2}{" "}
                  • 📍{" "}
                  {restaurant?.distance != null
                    ? restaurant?.distance.toFixed(1)
                    : 2}{" "}
                  km • 🔥 {restaurant?.reviewCount} đã đặt
                </p>
                <button
                  className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
                  onClick={() =>
                    navigate(`/restaurant/${restaurant.title}/${restaurant.id}`)
                  }
                >
                  Đặt Ngay
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
