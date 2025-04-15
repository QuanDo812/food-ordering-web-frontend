import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import { useDispatch, useSelector } from 'react-redux';
import './Navbar.css'
import { logout } from '../../../state/Auth/Action';

const Navbar = () => {
  const navigate = useNavigate();
  const { auth, cart } = useSelector((store) => store);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch()

  const handleLogout = ()=>{
    console.log('logout success')
          dispatch(logout())
          navigate('/')
  }

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
          <SearchIcon onClick={()=> navigate('/search')} sx={{color: 'white', fontSize: '1.5rem' }} />
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
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={()=>navigate('/my-profile')}>Tài Khoản Của Tôi</li>
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={()=>navigate('/my-profile/orders')}>Đơn Mua</li>
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
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={()=>navigate('/account/login')}>Đăng nhập</li>
                    <li className="px-4 py-2 hover:text-orange-500  cursor-pointer" onClick={()=>navigate('/account/register')}>Đăng kí</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Giỏ hàng */}
        <IconButton onClick={() => navigate('/cart')}>
          <Badge color="white" badgeContent={cart?.cart?.cartItems?.length}>
            <ShoppingCartIcon sx={{ fontSize: '1.5rem', color: 'white' }} />
          </Badge>
        </IconButton>
      </div>
    </div>
  );
};

export default Navbar;
