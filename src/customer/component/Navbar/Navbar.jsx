import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css'
import { getUser, logout } from '../../../state/Auth/Action';
import { motion } from 'framer-motion';
import { findCart } from '../../../state/Customer/Cart/Action';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import LockIcon from '@mui/icons-material/Lock';


const Navbar = () => {
  const navigate = useNavigate();
  const { auth, cart } = useSelector((store) => store);
  const [open, setOpen] = useState(false);

  const [showLoginModal, setShowLoginModal] = useState(false); // Thêm trạng thái modal

  const dispatch = useDispatch()
  const jwt = sessionStorage.getItem("jwt")


  const handleLogout = () => {
    console.log('logout success')
    dispatch(logout())
    navigate('/')
  }

  const handleCartClick = () => {
    if (!auth?.user) {
      setShowLoginModal(true); // Hiển thị modal nếu chưa đăng nhập
    } else {
      navigate('/cart'); // Điều hướng đến giỏ hàng nếu đã đăng nhập
    }
  };

  const handleOnclickLogo = () => {
    if (auth.user?.role == "ROLE_RESTAURANT_OWNER") {
      navigate('/admin/restaurant/')
    }
    if (auth.user?.role == "ROLE_SHIPPER") {
      navigate('/shipper/')
    }
    if (auth.user?.role == "ROLE_CUSTOMER") {
      navigate('/')
    }
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Main Navbar */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-5 lg:px-20 py-4 shadow-md">
          <div className="w-full flex items-center justify-between">
            {/* Logo Section */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleOnclickLogo()}
            >
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2021/10/Logo-Hoc-Vien-Cong-Nghe-Buu-Chinh-Vien-Thong-PTIT.png"
                alt="GrabFood"
                className="h-8 w-auto"
              />
              <span className="text-2xl font-bold text-white tracking-tight">
                MarcusGrabFood
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6 ml-auto">
              {/* Search Button */}
              <button
                onClick={() => navigate('/search')}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <SearchIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
              </button>

              {/* User Section */}
              <div
                className="relative group" // Changed from relative to relative group
                onMouseEnter={() => setOpen(true)}

              >
                {auth.user?.fullName ? (
                  <div className="flex items-center gap-3 cursor-pointer">
                    <Avatar
                      sx={{
                        bgcolor: 'white',
                        color: '#f97316',
                        width: 40,
                        height: 40,
                        fontWeight: 600
                      }}
                    >
                      {auth?.user?.fullName[0].toUpperCase()}
                    </Avatar>
                    <span className="text-white font-medium hidden lg:block">
                      {auth?.user?.fullName}
                    </span>

                    {/* Enhanced Dropdown */}
                    {open && (
                      <div onMouseLeave={() => setOpen(false)} className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-[9999]">
                        {/* Add hover gap element */}
                        <div className="absolute -top-2 left-0 right-0 h-2" />
                        <div className="p-4 border-b border-gray-100">
                          <p className="font-medium text-gray-900">
                            {auth?.user?.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {auth?.user?.email}
                          </p>
                        </div>
                        <ul className="py-2">
                          <li>
                            <button
                              onClick={() => navigate('/my-profile')}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-3"
                            >
                              <PersonIcon sx={{ fontSize: '1.25rem' }} />
                              Tài Khoản Của Tôi
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => navigate('/my-profile/orders')}
                              className="w-full px-4 py-2 text-left hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-3"
                            >
                              <ShoppingCartIcon sx={{ fontSize: '1.25rem' }} />
                              Đơn Mua
                            </button>
                          </li>
                          {auth?.user?.role === "ROLE_RESTAURANT_OWNER" && (
                            <li>
                              <button
                                onClick={() => navigate('/admin/restaurant/')}
                                className="w-full px-4 py-2 text-left hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-3"
                              >
                                <StoreIcon sx={{ fontSize: '1.25rem' }} />
                                Quản lí quán ăn
                              </button>
                            </li>
                          )}
                          {auth?.user?.role === "ROLE_SHIPPER" && (
                            <li>
                              <button
                                onClick={() => navigate('/shipper/')}
                                className="w-full px-4 py-2 text-left hover:bg-orange-50 text-gray-700 hover:text-orange-600 flex items-center gap-3"
                              >
                                <LocalShippingIcon sx={{ fontSize: '1.25rem' }} />
                                Giao hàng
                              </button>
                            </li>
                          )}
                          <li className="border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-3"
                            >
                              <LogoutIcon sx={{ fontSize: '1.25rem' }} />
                              Đăng Xuất
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate('/account/login')}
                    className="flex items-center gap-2 hover:bg-white/10 py-2 px-4 rounded-full transition-colors"
                  >
                    <PersonIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                    <span className="text-white font-medium hidden lg:block">
                      Đăng nhập
                    </span>
                  </button>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={handleCartClick}
                className="p-2 hover:bg-white/10 rounded-full transition-colors relative"
              >
                <Badge
                  badgeContent={cart?.cart?.cartItems?.length}
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: 'white',
                      color: '#f97316',
                      fontWeight: 600
                    }
                  }}
                >
                  <ShoppingCartIcon sx={{ color: 'white', fontSize: '1.75rem' }} />
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal - Enhanced */}
      {showLoginModal && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
            onClick={() => setShowLoginModal(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-white rounded-2xl shadow-xl z-[61] p-6"
          >
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✖
            </button>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto flex items-center justify-center">
                <LockIcon sx={{ fontSize: '2rem', color: '#f97316' }} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Bạn cần đăng nhập
                </h2>
                <p className="text-gray-600 mt-2">
                  Đăng nhập để xem giỏ hàng và tiếp tục mua sắm.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    navigate('/account/login')
                    setShowLoginModal(false)
                  }}
                  className="flex-1 bg-orange-500 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Để sau
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Spacing div to prevent content from hiding under navbar */}
      <div className="h-16" />
    </>
  );
};

export default Navbar;
