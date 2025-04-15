import { GET_HISTORY_SHIPPER_ORDER_REQUEST, GET_HISTORY_SHIPPER_ORDER_SUCCESS, GET_SHIPPER_ORDER_FAILURE, GET_SHIPPER_ORDER_REQUEST, GET_SHIPPER_ORDER_SUCCESS, UPDATE_COMPLETED_ORDER_FAILURE, UPDATE_COMPLETED_ORDER_REQUEST, UPDATE_COMPLETED_ORDER_SUCCESS, UPDATE_SHIPPER_ORDER_FAILURE, UPDATE_SHIPPER_ORDER_REQUEST, UPDATE_SHIPPER_ORDER_SUCCESS } from "./ActionTypes";
import { api } from "../../../customer/component/config/api";


export const getAllShipperOrder = (jwt) => {
  return async (dispatch) => {
    dispatch({ type: GET_SHIPPER_ORDER_REQUEST });
    try {
      const { data } = await api.get('/api/shipper/orders', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("created shipper order data", data)
      dispatch({ type: GET_SHIPPER_ORDER_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: GET_SHIPPER_ORDER_FAILURE, payload: error });
    }
  };
};

export const getHistoryShipperOrder = (jwt) => {
  return async (dispatch) => {
    dispatch({ type: GET_HISTORY_SHIPPER_ORDER_REQUEST });
    try {
      const { data } = await api.get('/api/shipper/orders/history', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_HISTORY_SHIPPER_ORDER_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: GET_SHIPPER_ORDER_FAILURE, payload: error });
    }
  };
};

export const updateShipperOrderStatus = (jwt, orderId) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_SHIPPER_ORDER_REQUEST });
    try {
      const { data } = await api.put(`/api/shipper/orders/delivering/${orderId}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: UPDATE_SHIPPER_ORDER_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: UPDATE_SHIPPER_ORDER_FAILURE, payload: error });
    }
  };
};

export const updateOrderSuccess = (jwt, orderId, image) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_COMPLETED_ORDER_REQUEST });
    try {
      const { data } = await api.put(`/api/shipper/orders/success/${orderId}`, { image: image }, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: UPDATE_COMPLETED_ORDER_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error)
      dispatch({ type: UPDATE_COMPLETED_ORDER_FAILURE, payload: error });
    }
  };
};