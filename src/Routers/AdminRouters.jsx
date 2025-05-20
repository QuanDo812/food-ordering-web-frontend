import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import CreateRestaurantForm from '../Admin/AddRestaurants/CreateRestaurantForm';
import Admin from "../Admin/Admin";
import { getRestaurantByUserId } from '../state/Customer/Restaurant/Action';
import { ClipLoader } from 'react-spinners';


const AdminRouters = () => {
  const { auth, restaurant } = useSelector((store) => store);
  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt") || auth?.jwt;
  const loading = useSelector((store) => store.restaurant.loading);

  useEffect(() => {
    if (jwt != null) {
      dispatch(getRestaurantByUserId(jwt));
    }
  }, [auth.user]);
  return (
    <div>
      {/* {restaurant?.loading && jwt != null ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : ( */}
      <Routes>
        <Route
          path="/*"
          element={

            !restaurant?.usersRestaurant ? (
              <CreateRestaurantForm />
            ) : (
              <Admin />
            )
          }
        />
      </Routes>
      {/* )} */}
    </div>
  );
}

export default AdminRouters
