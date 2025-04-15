import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Profile from '../customer/component/Profile/Profile'
import Home from '../customer/component/Home/Home'
import Auth from '../customer/component/Auth/Auth'
import RestaurantPage from '../customer/component/Restaurant/RestaurantPage'
import FoodDetails from '../customer/component/Food/FoodDetails'
import CartTest from '../customer/component/Cart/CartTest'
import PaymentResult from '../customer/component/Payment/PaymentResult'
import Search from '../customer/component/Search/Search'

const CustomerRouters = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/my-profile/*' element={<Profile />}></Route>
        <Route path='/account/*' element={<Home />}></Route>
        <Route exact path='/restaurant/:title/:id' element={<RestaurantPage />} />
        <Route path='/food/foodDetails/:foodId' element={<FoodDetails />} />
        <Route path='/cart' element={<CartTest />} />
        <Route path='/payment-result/:cash?' element={<PaymentResult />} />
        <Route path='/search/:query?/:foodSearch?' element={<Search />} />
      </Routes>
      <Auth />
    </div>
  )
}

export default CustomerRouters
