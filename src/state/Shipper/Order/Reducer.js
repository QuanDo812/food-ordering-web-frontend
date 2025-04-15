// Reducers.js

import { UPDATE_CARTITEM_FAILURE, UPDATE_CARTITEM_REQUEST, UPDATE_CARTITEM_SUCCESS } from "../../Customer/Cart/ActionTypes";
import { GET_HISTORY_SHIPPER_ORDER_FAILURE, GET_HISTORY_SHIPPER_ORDER_REQUEST, GET_HISTORY_SHIPPER_ORDER_SUCCESS, GET_SHIPPER_ORDER_FAILURE, GET_SHIPPER_ORDER_REQUEST, GET_SHIPPER_ORDER_SUCCESS, UPDATE_COMPLETED_ORDER_FAILURE, UPDATE_COMPLETED_ORDER_REQUEST, UPDATE_COMPLETED_ORDER_SUCCESS } from "./ActionTypes";

const initialState = {
  order: null,
  orders: [],
  historyOrders: [],
  loading: false,
  error: null,
};

const shipperOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_SHIPPER_ORDER_REQUEST:
    case GET_HISTORY_SHIPPER_ORDER_REQUEST:
    case UPDATE_CARTITEM_REQUEST:
    case UPDATE_COMPLETED_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_SHIPPER_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        orders: action.payload,
      };
    case GET_HISTORY_SHIPPER_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        historyOrders: action.payload,
      };
    case UPDATE_COMPLETED_ORDER_SUCCESS:
    case UPDATE_CARTITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload,
      };
    case GET_SHIPPER_ORDER_FAILURE:
    case UPDATE_CARTITEM_FAILURE:
    case GET_HISTORY_SHIPPER_ORDER_FAILURE:
    case UPDATE_COMPLETED_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default shipperOrderReducer;

