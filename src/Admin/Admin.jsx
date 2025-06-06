import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import RestaurantDashboard from "./Dashboard/RestaurantDashboard";
import RestaurantsOrder from "./Orders/RestaurantsOrder";
import RestaurantsMenu from "./Food/RestaurantsMenu";
import AddMenuForm from "./Food/AddMenuForm";
import CreateRestaurantForm from "./AddRestaurants/CreateRestaurantForm";
import IngredientTable from "./Events/Events";
import Category from "./Category/Category";
import Ingredients from "./Ingredients/Ingredients";
import { useDispatch, useSelector } from "react-redux";
import {
  getIngredientCategory,
  getIngredientsOfRestaurant,
} from "../state/Admin/Ingredients/Action";
import { getRestaurantsCategory } from "../state/Customer/Restaurant/Action";
import Details from "./Details/Details";
import AdminNavbar from "./AdminNavbar";
import { fetchRestaurantsOrder } from "../state/Admin/Order/restaurants.order.action";
import { getMenuItemsByRestaurantId } from "../state/Customer/Menu/Action";

const Admin = () => {
  const dispatch = useDispatch();
  const [openSideBar, setOpenSideBar] = useState(false);
  const handleOpenSideBar = () => setOpenSideBar(true);
  const handleCloseSideBar = () => setOpenSideBar(false);
  const { auth, restaurant, ingredients } = useSelector((store) => store);
  const jwt = sessionStorage.getItem("jwt");
  useEffect(() => {
    if (restaurant.usersRestaurant) {
      dispatch(
        getIngredientCategory({ jwt, restaurantId: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getIngredientsOfRestaurant({ jwt, id: restaurant.usersRestaurant?.id })
      );
      dispatch(
        getRestaurantsCategory({
          jwt: auth.jwt || jwt,
          restaurantId: restaurant.usersRestaurant?.id,
        })
      );

      dispatch(getMenuItemsByRestaurantId({
        restaurantId: restaurant.usersRestaurant?.id,
        jwt: sessionStorage.getItem("jwt"),
        foodCategory: "",
      }));

      dispatch(
        fetchRestaurantsOrder({
          restaurantId: restaurant.usersRestaurant?.id,
          jwt: auth.jwt || jwt,
        })

      );
    }
  }, [restaurant.usersRestaurant]);
  return (
    <div className="mt-10">
      <AdminNavbar handleOpenSideBar={handleOpenSideBar} />
      <div className="lg:flex justify-between">
        <div className="">
          <AdminSidebar handleClose={handleCloseSideBar} open={openSideBar} />
        </div>

        <div className="lg:w-[80vw]">
          <Routes>
            <Route path="/" element={<RestaurantDashboard />} />
            <Route path="/orders" element={<RestaurantsOrder />} />
            <Route path="/menu" element={<RestaurantsMenu />} />
            <Route path="/add-menu" element={<AddMenuForm />} />
            <Route path="/add-restaurant" element={<CreateRestaurantForm />} />
            <Route path="/event" element={<IngredientTable />} />
            <Route path="/ingredients" element={<Ingredients />} />
            <Route path="/category" element={<Category />} />
            <Route path="/details" element={<Details />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
