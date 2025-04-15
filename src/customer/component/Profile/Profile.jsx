import React from 'react'
import ProfileSidebar from './ProfileSidebar'
import UserProfile from './user/UserProfile'
import Favorite from './Favorite'
import Orders from './Orders'
import CustomerEvents from './CustomerEvents'
import Notifications from './Notifications'
import UsersAddresses from './UsersAddresses'
import { Route, Routes } from 'react-router-dom'
import ResetPassword from './user/ResetPassword'

const Profile = () => {
  return (
    <div className='mt-7'>
      <div className="lg:flex justify-between">
      <div className="sticky top-[66px] h-screen lg:w-[20%] overflow-y-auto">
    <ProfileSidebar />
  </div>

      {/* <Divider orientation="vertical" flexItem /> */}
      <div className="lg:w-[80%]">
        <Routes>
          <Route path="/account" element={<UserProfile/>} />
        <Route path="/" element={<UserProfile/>} />
          <Route path="/orders" element={<Orders/>} />
          <Route path="/address" element={<UsersAddresses/>} />
          <Route path="/favorites" element={<Favorite/>} />
          <Route path="/payments" element={<Orders/>} />
          <Route path="/events" element={<CustomerEvents/>} />
          <Route path="/notification" element={<Notifications/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />
        </Routes>
      </div>
    </div>
    </div>
  )
}

export default Profile
