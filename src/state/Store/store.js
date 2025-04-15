import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import {thunk} from "redux-thunk";

import authReducer from '../Auth/Reducer'
import restaurantReducer from "../Customer/Restaurant/Reducer";
import menuItemReducer from "../Customer/Menu/Reducer";
import cartReducer from "../Customer/Cart/Reducer";
import { orderReducer } from "../Customer/Order/Reducer";
import { ingredientReducer } from "../Admin/Ingredients/Reducer";
import {restaurantsOrderReducer} from "../Admin/Order/restaurants.order.reducer";
import shipperOrderReducer from "../Shipper/Order/Reducer";



  


const rootReducer=combineReducers({

    auth:authReducer,
    restaurant:restaurantReducer,
    menu:menuItemReducer,
    cart:cartReducer,
    order:orderReducer,
    // admin
    ingredients:ingredientReducer,
    restaurantsOrder: restaurantsOrderReducer,

    //shipper
    shipperOrder: shipperOrderReducer
    
})


export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

