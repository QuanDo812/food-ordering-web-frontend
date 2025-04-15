import { Route, Routes } from "react-router-dom";
import ShipperOrders from "../Shipper/ShipperOrders";
import HistoryShippingOrders from "../Shipper/HistoryShippingOrders";
import ShipperSidebar from "../Shipper/ShipperSidebar";
import SuccessShippingOrder from "../Shipper/SuccessShippingOrder";

const ShipperRouters = () => {
  return (

    <div className='mt-7'>
      <div className="lg:flex justify-between">
        <div className="sticky top-[66px] h-screen lg:w-[20%] overflow-y-auto">
          <ShipperSidebar />
        </div>

        {/* <Divider orientation="vertical" flexItem /> */}
        <div className="lg:w-[100%]">
          <Routes>
            <Route path="/" element={<ShipperOrders />} />
            <Route path="/delivering" element={<HistoryShippingOrders />} />
            <Route path="/completing" element={<SuccessShippingOrder />} />
          </Routes>
        </div>
      </div>
    </div>

  );
};

export default ShipperRouters;