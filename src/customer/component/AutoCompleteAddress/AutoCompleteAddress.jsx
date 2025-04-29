import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllRestaurantsAction, getAllRestaurantsDistance } from "../../../state/Customer/Restaurant/Action";
import { useNavigate } from "react-router-dom";

const AutoCompleteAddress = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch()
  const navingate = useNavigate()

  // Kiểm tra người dùng đã đăng nhập chưa
  const isLogin = auth.jwt != null || localStorage.getItem("jwt") != null;

  // useEffect(() => {
  //   if (query.length < 3) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   // Sử dụng debounce (1 giây)
  //   const timeoutId = setTimeout(() => {
  //     fetchSuggestions(query);
  //   }, 1000);

  //   return () => clearTimeout(timeoutId);
  // }, [query]);

  // const fetchSuggestions = async (input) => {
  //   setLoading(true);
  //   const url = `https://nominatim.openstreetmap.org/search?format=json&countrycodes=VN&limit=5&q=${encodeURIComponent(input)}`;

  //   try {
  //     const response = await axios.get(url, {
  //       headers: { "User-Agent": "YourAppName" },
  //     });
  //     setSuggestions(response.data);
  //   } catch (error) {
  //     console.error("Lỗi khi lấy gợi ý địa chỉ:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSelect = (address) => {
    setQuery(address.display_name);
    setSuggestions([]);
    onSelect(address);
  };

  const handleSubmit = () => {
    if (query.length < 3) {
      alert("Vui lòng nhập ít nhất 3 ký tự để tìm kiếm!");
      return;
    }
    console.log("finding..............")
    // dispatch(getAllRestaurantsDistance({jwt: auth?.jwt || localStorage.getItem("jwt"), address: query}))
    navingate(`/search/${query}`)
  };

  return (
    <div style={{ position: "relative", width: "500px", margin: "0 auto" }}>

      <div style={{ display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nhập địa chỉ..."
          style={{
            flex: 1,
            color: "black",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "white",
            cursor: "text",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />

        {/* Nút Search */}
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 15px",
            fontSize: "16px",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",

          }}
          className="bg-[#fe6d2e] hover:bg-orange-400"
        >
          Tìm kiếm
        </button>
      </div>

      {/* {loading && <p style={{ color: "gray", fontSize: "14px" }}>Đang tìm kiếm...</p>}
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            background: "white",
            listStyle: "none",
            color: "black",
            padding: 0,
            margin: 0,
            border: "1px solid #ccc",
            maxHeight: "200px",
            overflowY: "auto",
            borderRadius: "5px",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
          }}
        >
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
};

export default AutoCompleteAddress;
