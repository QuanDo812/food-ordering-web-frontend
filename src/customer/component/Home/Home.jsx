import React, { useEffect, useState } from 'react'
import "./Home.css"
import { Box, Button, Divider } from '@mui/material';
import MutilRestaurants from '../MutilItems/MutilRestaurants';
import ListFood from '../Food/ListFood';
import AutoCompleteAddress from '../AutoCompleteAddress/AutoCompleteAddress';
import Auth from '../Auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRestaurantsAction, getAllRestaurantsDistance } from '../../../state/Customer/Restaurant/Action';
import { ClipLoader } from 'react-spinners'; // Spinner từ react-spinners



const Home = () => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const { auth, restaurant } = useSelector((store) => store)
  const jwt = auth?.jwt || sessionStorage.getItem("jwt")


  // useEffect(()=>{
  //   if (jwt != null) {
  //     dispatch(getAllRestaurantsDistance({jwt: jwt, address: localStorage.getItem("address")|| "HOC VIEN CONG NGHE BUU CHINH VIEN THONG HA NOI"}));
  //   }
  // },[])


  return (
    <div className=''>
      {restaurant?.restaurants.length === 0 && jwt != null ? (
        <div className="flex justify-center items-center h-[60vh]">
          <ClipLoader color="#FF5722" size={60} />
        </div>
      ) : (
        <>
          <section className="banner relative flex flex-col justify-center items-center h-screen">
            <div className="w-[50vw] z-10 text-center">
              {/* <p className="text-2xl lg:text-7xl font-bold z-10 py-5">Good Food</p> */}
              <p className="z-10 text-orange-500 font-bold text-xl lg:text-4xl">Bạn muốn giao đồ ăn đến đâu?</p>

              {/* Đưa AutoCompleteAddress vào giữa */}
              <div className="mt-10 flex text-center justify-center">
                <div>
                  <AutoCompleteAddress onSelect={setSelectedAddress} />
                </div>
                {/* <div className='mt-1 mx-5'>
      <button className="bg-green-600 text-white px-4 py-2 rounded-md transition-colors hover:bg-green-500">
  Search
</button>
      </div> */}
              </div>

              {/* {selectedAddress && (
      <div className="mt-3 text-white">
        <h3 className="text-lg font-bold">Địa chỉ được chọn:</h3>
        <p>{selectedAddress.display_name}</p>
        <p><strong>Toạ độ:</strong> {selectedAddress.lat}, {selectedAddress.lon}</p>
      </div>
    )} */}
            </div>

            {/* <div className="cover absolute top-0 left-0 right-0"></div> */}
          </section>
          <Divider />
          <section className="lg:mx-10 p-10 lg:py-10 lg:px-20 items-center">
            <div className="items-center">

              <MutilRestaurants restaurants={restaurant.restaurants} />
            </div>
          </section>
          <Divider />
          <section className=" lg:px-20 my-20">
            <div className="my-8 mx-10">
              <h2 style={{ fontSize: "26px", fontWeight: "bold" }}>

                There's something for everyone!
              </h2>
            </div>
            <ListFood />
          </section>

        </>
      )}

    </div>
  )
}

export default Home
