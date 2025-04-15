import React from 'react'
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import CreateRestaurantForm from '../Admin/AddRestaurants/CreateRestaurantForm';
import Admin from "../Admin/Admin";


const AdminRouters = () => {
    const { auth, restaurant } = useSelector((store) => store);
    return (
      <div>
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
      </div>
    );
}

export default AdminRouters
