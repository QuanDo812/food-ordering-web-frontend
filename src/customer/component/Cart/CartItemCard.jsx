import { Button, Chip, Divider, IconButton } from "@mui/material";
import React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { useDispatch, useSelector } from "react-redux";
import { removeCartItem, updateCartItem } from "../../../state/Customer/Cart/Action";



const CartItemCard = ({ item }) => {

  const dispatch = useDispatch();
  const jwt = sessionStorage.getItem("jwt");
  const { auth } = useSelector(store => store)
  const handleUpdateCartItem = (value) => {
    if (value === -1 && item.quantity == 1) {
      handleRemoveCartItem()
    }
    const data = { cartItemId: item.id, quantity: item.quantity + value }
    dispatch(
      updateCartItem({ data, jwt: auth.jwt || jwt })
    );
  };
  const handleRemoveCartItem = () => {
    dispatch(removeCartItem({ cartItemId: item.id, jwt: auth.jwt || jwt }))

  }
  return (
    <div className="flex gap-4 p-4 bg-orange-50/50 rounded-xl">
      <div className="flex-shrink-0">
        <img
          className="w-24 h-24 object-cover rounded-lg"
          src={item.food.images[0]}
          alt={item.food.name}
        />
      </div>

      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <h3 className="font-medium text-gray-800">{item.food.name}</h3>
          <p className="font-semibold text-orange-600">
            {item?.totalPrice.toLocaleString()} VNĐ
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <IconButton
            onClick={() => handleUpdateCartItem(-1)}
            className="hover:bg-orange-100"
            sx={{
              color: "#ea580c",
              padding: "4px"
            }}
          >
            <RemoveCircleOutlineIcon fontSize="small" />
          </IconButton>

          <span className="w-8 text-center font-medium text-gray-700">
            {item.quantity}
          </span>

          <IconButton
            onClick={() => handleUpdateCartItem(1)}
            className="hover:bg-orange-100"
            sx={{
              color: "#ea580c",
              padding: "4px"
            }}
          >
            <AddCircleOutlineIcon fontSize="small" />
          </IconButton>
        </div>

        {item?.ingredients?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.ingredients.map((ingredient, idx) => (
              <Chip
                key={idx}
                label={ingredient}
                size="small"
                sx={{
                  backgroundColor: '#fff7ed',
                  color: '#ea580c',
                  borderColor: '#fed7aa',
                  fontSize: '0.75rem'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
