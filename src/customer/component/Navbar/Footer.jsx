import React from "react";
import { Box, Typography, Divider, TextField, Button } from "@mui/material";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <Box className="bg-gray-900 text-white py-12 mt-10">
      <Box className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Cột 1: Logo & Giới thiệu */}
        <Box>
          <Typography variant="h4" className="font-bold text-xl">PTIT FOOD</Typography>
          <Typography variant="body2" className="text-gray-400 mt-5">
            Chúng tôi cung cấp những dịch vụ tốt nhất dành cho bạn. Hãy kết nối ngay!
          </Typography>
        </Box>

        {/* Cột 2: Liên kết nhanh */}
        <Box>
          <Typography variant="h6" className="font-semibold text-lg">Liên kết nhanh</Typography>
          <ul className="mt-3 space-y-2">
            <li className="hover:text-gray-400 transition duration-300"><a href="/">Trang chủ</a></li>
            <li className="hover:text-gray-400 transition duration-300"><a href="/about">Giới thiệu</a></li>
            <li className="hover:text-gray-400 transition duration-300"><a href="/services">Dịch vụ</a></li>
            <li className="hover:text-gray-400 transition duration-300"><a href="/contact">Liên hệ</a></li>
          </ul>
        </Box>

        {/* Cột 3: Thông tin liên hệ */}
        <Box>
          <Typography variant="h6" className="font-semibold text-lg">Liên hệ</Typography>
          <Box className="mt-3">
            <Typography className="flex items-center space-x-2 text-gray-400">
              <FaPhone /> <span>+84 123 456 789</span>
            </Typography>
            <Typography className="flex items-center space-x-2 text-gray-400 mt-2">
              <FaEnvelope /> <span>contact@mywebsite.com</span>
            </Typography>
          </Box>
        </Box>

        {/* Cột 4: Mạng xã hội & Đăng ký nhận tin */}
        <Box>
          <Typography variant="h6" className="font-semibold text-lg">Kết nối với chúng tôi</Typography>
          <Box className="flex space-x-4 mt-3">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaInstagram size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300"><FaLinkedin size={24} /></a>
          </Box>

          {/* Form nhập email */}
          <Typography className="mt-5 text-gray-400">Nhận tin mới nhất</Typography>
          <Box className="flex mt-3">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Nhập email..."
              className="bg-white rounded-l-md"
            />
            <Button
              variant="contained"
              color="success"
              className="rounded-r-md"
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Đường kẻ ngăn cách */}
      <Divider className="bg-gray-700 my-6" />

      {/* Bản quyền */}
      <Typography variant="body2" className="text-center text-gray-500">
        © 2025 MyWebsite. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
