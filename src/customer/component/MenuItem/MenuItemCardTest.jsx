import { AddCircle } from "@mui/icons-material";

const MenuItemCardTest = ({ food, onClick }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 cursor-pointer border-[1px]
       border-transparent hover:border-orange-500 hover:scale-[102%] transition-transform duration-200 ease-in-out" onClick={onClick}>
        <img src={food?.images[0]} alt={food?.name} className="w-full h-32 object-cover rounded-lg" />
        <h3 className="mt-2 text-lg font-semibold">{food?.name}</h3>
        <p className="text-gray-500">{food?.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-orange-500 font-bold">{food?.price.toLocaleString()} VNĐ</span>
          <AddCircle className="text-orange-500 cursor-pointer" style={{ fontSize: '35px' }} />
        </div>
      </div>
    );
  };
  
  export default MenuItemCardTest;
  