import {
  GET_USERS_NOTIFICATION_SUCCESS,
  GET_USERS_ORDERS_FAILURE,
  GET_USERS_ORDERS_REQUEST,
  GET_USERS_ORDERS_SUCCESS,
  UPDATE_ORDER_STATUS_FAILURE,
  UPDATE_ORDER_STATUS_REQUEST,
  UPDATE_ORDER_STATUS_SUCCESS,
} from "./ActionTypes";

const initialState = {
  loading: false,
  orders: [],
  error: null,
  notifications: []
};
export const orderReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USERS_ORDERS_REQUEST:
    case UPDATE_ORDER_STATUS_REQUEST:
      return { ...state, error: null, loading: true };

    case GET_USERS_ORDERS_SUCCESS:
      return { ...state, error: null, loading: false, orders: payload };
    case UPDATE_ORDER_STATUS_SUCCESS:
      const updatedOrders = state.orders.map((order) =>
        order.id === payload.id ? payload : order
      );
      return { ...state, loading: false, orders: updatedOrders };
    case GET_USERS_NOTIFICATION_SUCCESS:
      return { ...state, notifications: payload, error: null, loading: false };

    case GET_USERS_ORDERS_FAILURE:
    case UPDATE_ORDER_STATUS_FAILURE:
      return { ...state, error: payload, loading: false };


    default:
      return state;
  }
};
