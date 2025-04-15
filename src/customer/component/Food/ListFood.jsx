import React from 'react'
import { foodList } from './foodList';
import { useNavigate } from 'react-router-dom';

const ListFood = () => {
  const navigate = useNavigate()

  const handleSearch = (foodName) => {
    const query = localStorage.getItem("address") || "Hoc vien Cong nghe Buu Chinh Vien Thong, Ha Noi";
    navigate(`/search/${query}/${foodName}`);
  }

  return (
    <div className="grid grid-cols-4 gap-x-20 gap-y-10 px-20">
      {foodList.map((food) => (
        <div onClick={() => handleSearch(food?.title)} className="cursor-pointer">
          <img src={food.image} alt={food?.title} className="rounded-sm overflow-hidden w-full h-40 object-cover" />
          <div className="py-3 font-bold black"><p>{food?.title}</p></div>
        </div>
        
      ))}
    </div>
  )
}

export default ListFood;
