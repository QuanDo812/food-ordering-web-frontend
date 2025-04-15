import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@mui/material";

const AdminNavbar = ({handleOpenSideBar}) => {
  const navigate = useNavigate();
  const { auth, cart } = useSelector((store) => store);
  const dispatch = useDispatch();

  



  return (
    <div className="lg:hidden px-5 z-50 py-[.8rem] bg-[#e91e63]  lg:px-20 flex justify-between">
      <div className="flex items-center space-x-4">
        <div
          className="lg:mr-10 cursor-pointer flex items-center space-x-4"
        >
          <IconButton onClick={handleOpenSideBar}><MenuIcon/></IconButton>
          <li className="logo font-semibold text-gray-300 text-2xl">
            Good Food
          </li>
        </div>
        {/* <li className="font font-semibold">Home</li> */}
      </div>
      

    </div>
  );
};

export default AdminNavbar;
