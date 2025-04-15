import "./App.css";
import { Box } from "@mui/material";
import Navbar from "./customer/component/Navbar/Navbar";
import Footer from "./customer/component/Navbar/Footer";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./state/Auth/Action";
import { useEffect } from "react";
import { findCart } from "./state/Customer/Cart/Action";
import { getAllRestaurantsAction, getAllRestaurantsDistance, getRestaurantByUserId } from "./state/Customer/Restaurant/Action";
import Routers from "./Routers/Routers";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const navigate = useNavigate();

  const jwt = localStorage.getItem("jwt")

  useEffect(() => {
    if (auth.jwt != null || jwt != null) {
      console.log("jwt: ", auth?.jwt)
      dispatch(getUser(auth.jwt || jwt))
      dispatch(findCart(auth.jwt || jwt));
      dispatch(getAllRestaurantsDistance({ jwt: auth.jwt || jwt, address: "Hoc vien cong nghe buu chinh vien thong" }));
    }
  }, [auth.jwt]);

  useEffect(() => {
    if (auth.user?.role == "ROLE_RESTAURANT_OWNER") {
      dispatch(getRestaurantByUserId(auth.jwt || jwt));
      navigate('/admin/restaurant/')
    }
    if (auth.user?.role == "ROLE_SHIPPER") {
      navigate('/shipper/')
    }
  }, [auth.user]);

  return (

    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <Box sx={{ marginBottom: "40px" }}>
        <Navbar />
      </Box>

      {/* Nội dung chính, đảm bảo chiếm đủ không gian */}
      <Box sx={{ flex: "1 1 auto" }}>
        <Routers />
      </Box>

      {/* Footer luôn ở cuối */}
      <Box sx={{ flexShrink: 0 }}>
        <Footer />
      </Box>
    </Box>



  );
}

export default App;
