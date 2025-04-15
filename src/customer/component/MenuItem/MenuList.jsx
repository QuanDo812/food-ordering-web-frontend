import { useState } from "react";
import MenuDetail from "./MenuDetail";
import MenuItemCardTest from "./MenuItemCardTest";
import { AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";


const foodData = [
  { id: 1, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 2, name: "Trà Vải Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà vải size XL thơm ngon, vị ngọt tự nhiên." },
  { id: 3, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 4, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 5, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 6, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 7, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
  { id: 8, name: "Trà Đào Khổng Lồ", price: 18000, image: "https://food-cms.grab.com/compressed_webp/items/VNITE2024110804535514748/detail/menueditor_item_b770deaec3414b8dab6e47b9c6bb3c2d_1731041587303595778.webp", desc: "Trà đào size XL với đào chín ngọt, trà thơm mát, đá lạnh." },
];

const MenuList = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {foodData.map((food) => (
        <MenuItemCardTest key={food.id} food={food} onClick={() => setSelectedFood(food)} />
      ))}

      {/* Hiển thị FoodDetail khi có món được chọn */}
      <AnimatePresence>
      {selectedFood && <MenuDetail food={selectedFood} onClose={() => setSelectedFood(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default MenuList;
