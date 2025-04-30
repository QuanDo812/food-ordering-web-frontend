import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AdminRouters from './AdminRouters';
import CustomerRouters from './CustomerRouters';
import ShipperRouters from './ShippperRouters';


const Routers = () => {
  const { auth } = useSelector((store) => store);


  return (
    <div>
      <Routes>

        <Route
          path="/admin/restaurant/*"
          element={<AdminRouters />}
        />
        <Route path="/*" element={<CustomerRouters />} />
        <Route path="/shipper/*" element={<ShipperRouters />} />
      </Routes>
    </div>
  )
}

export default Routers
