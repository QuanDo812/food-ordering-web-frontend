import React, { useEffect, useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { Element, scroller } from "react-scroll";
import ListFood from "../Food/ListFood";
import MenuItemCard from "../MenuItem/MenuItemCard";
import MenuList from "../MenuItem/MenuList";
import MenuItemCardTest from "../MenuItem/MenuItemCardTest";
import { AnimatePresence } from "framer-motion";
import MenuDetail from "../MenuItem/MenuDetail";


const CategoryCard = ({ sections, menuItems }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFood, setSelectedFood] = useState(null);

  const handleTabChange = (_, newValue) => {
    setSelectedTab(newValue);
    scroller.scrollTo(sections[newValue].name, {
      duration: 800,
      smooth: "easeInOutQuart",
      offset: -110, // Cách Navbar một chút
    });
  };





  return (
    <Box>
      {/* Thanh Tabs giữ cố định dưới Navbar */}
      <Box sx={{ height: 64 }} /> {/* Dành khoảng trống cho Navbar nếu có */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        centered
        textColor="inherit" // 🔥 Giữ nguyên màu đặt trong sx, không bị xanh mặc định


        sx={{
          position: "sticky",
          top: 80, // Nếu có Navbar, điều chỉnh lại
          bgcolor: "white",
          zIndex: 1000,
          "& .MuiTab-root": { color: "black" }, // Màu chữ của Tab
          "& .Mui-selected": { color: "#fe6d2e" }, // Màu chữ khi Tab được chọn
          "& .MuiTabs-indicator": { backgroundColor: "#fe6d2e" }, // Màu thanh trượt

        }}
      >
        {sections.map((section, index) => (
          <Tab key={index} label={section?.name.charAt(0).toUpperCase() + section?.name.slice(1)} />
        ))}
      </Tabs>

      {/* Nội dung các mục */}
      <Box className="mt-8 px-6">
        {sections.map((section) => (
          <Element key={section.name} name={section.name} id={section.id} className="mt-10">
            <section className="mb-5"><Typography variant="h4" className="font-bold">
              {section.name}
            </Typography>
            </section>
            <section>
              {/* <Box display='flex' flexDirection='column' gap={2}>
              {menuItems.filter((p) => p.foodCategory.id === section.id).map((item) => (
                <MenuItemCard menuItem={item}/>
              ))}
            </Box>       */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {menuItems.filter((p) => p.foodCategory.id === section.id).map((item) => (
                  <MenuItemCardTest key={item.id} food={item} onClick={() => setSelectedFood(item)} />
                ))}
                {/* Hiển thị FoodDetail khi có món được chọn */}
                <AnimatePresence>
                  {selectedFood && <MenuDetail food={selectedFood} onClose={() => setSelectedFood(null)} />}
                </AnimatePresence>
              </div>


            </section>
          </Element>
        ))}
      </Box>
    </Box>
  );
};

export default CategoryCard;
