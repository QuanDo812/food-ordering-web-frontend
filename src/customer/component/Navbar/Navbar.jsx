import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css'
import { logout } from '../../../state/Auth/Action';
import { motion } from 'framer-motion';


const Navbar = () => {
  const navigate = useNavigate();
  const { auth, cart } = useSelector((store) => store);
  const [open, setOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Thêm trạng thái modal

  const dispatch = useDispatch()

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

  return (
    <div className="px-5 z-50 py-[.8rem] bg-[#FF5722] lg:px-20 flex justify-between fixed top-0 left-0 w-full">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <div className="cursor-pointer flex items-center space-x-4" onClick={() => navigate('/')}>
          <li className="li logo font-semibold text-white text-2xl">MarcusGrabFood</li>
        </div>
      </div>

      {/* Thanh công cụ bên phải */}
      <div className="flex items-center space-x-2 lg:space-x-10">
        {/* Nút tìm kiếm */}
        <IconButton>
          <SearchIcon onClick={() => navigate('/search')} sx={{ color: 'white', fontSize: '1.5rem' }} />
        </IconButton>

        {/* Avatar + Dropdown */}
        <div
          className="relative flex items-center space-x-3"
          onMouseEnter={() => setOpen(true)}
        >
          {auth.user?.fullName ? (
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar sx={{ bgcolor: 'white', color: 'black' }} className="bg-white">
                {auth.user.fullName[0].toUpperCase()}
              </Avatar>
              <span className="text-white">{auth?.user?.email}</span>

              {/* Dropdown menu */}
              {open && (
                <div className="absolute right-0 z-[9997] top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={() => navigate('/my-profile')}>Tài Khoản Của Tôi</li>
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={() => navigate('/my-profile/orders')}>Đơn Mua</li>
                    <li className="px-4 py-2 hover:text-red-500  cursor-pointer " onClick={handleLogout}>Đăng Xuất</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3 cursor-pointer">
              <IconButton onClick={() => navigate('/account/login')}>
                <PersonIcon sx={{ fontSize: '2rem', color: 'white' }} />
              </IconButton>
              <span className="white">Đăng nhập/Đăng kí</span>
              {open && (
                <div className="absolute right-0 z-[9997] top-full mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}>
                  <ul className="py-1">
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={() => navigate('/account/login')}>Đăng nhập</li>
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={() => navigate('/account/register')}>Đăng kí</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Giỏ hàng */}
        <IconButton onClick={handleCartClick}>
          <Badge color="white" badgeContent={cart?.cart?.cartItems?.length}>
            <ShoppingCartIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
          </Badge>
        </IconButton>
      </div>

      {showLoginModal && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-20 z-[9998]"
            onClick={() => setShowLoginModal(false)}
          ></div>

          {/* Modal */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.4 }}
            className="fixed top-[350px] left-[620px] transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-[9999] p-6 rounded-lg w-[400px]"
          >
            <div className="text-center">
              <button
                className="absolute top-3 right-3 text-gray-500 text-lg"
                onClick={() => setShowLoginModal(false)}
              >
                ✖
              </button>
              <h2 className="text-xl font-bold mt-3">Bạn cần đăng nhập</h2>
              <p className="text-gray-500 mt-2">
                Đăng nhập để xem giỏ hàng và tiếp tục mua sắm.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    navigate('/account/login')
                    setShowLoginModal(false)
                  }}
                  className="py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="py-2 px-4 border border-gray-300 rounded hover:border-gray-400 hover:text-gray-600"
                >
                  Để sau
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Navbar;
