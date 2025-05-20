import {
  ADD_TO_FAVORITES_FAILURE,
  ADD_TO_FAVORITES_REQUEST,
  ADD_TO_FAVORITES_SUCCESS,
  GET_USER_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_USER_REQUEST,
} from "./ActionType";
import { API_URL, api } from "../../customer/component/config/api";
import axios from "axios";

export const registerUser = (reqData) => async (dispatch) => {
  console.log("resgister request data ", reqData.userData)
  dispatch({ type: REGISTER_REQUEST });
  try {


    const { data } = await axios.post(`${API_URL}/auth/signup`, reqData.userData);
    reqData.navigate("/login")
    dispatch({ type: REGISTER_SUCCESS, payload: data.jwt });
  } catch (error) {
    console.log("catch error ------ ", error)
    dispatch({
      type: REGISTER_FAILURE,
      payload:
        error
    });
  }
};

export const loginUser = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const { data } = await axios.post(`${API_URL}/auth/signin`, reqData.data);
    if (data.jwt) sessionStorage.setItem("jwt", data.jwt)
    if (data.role == "ROLE_RESTAURANT_OWNER") {
      reqData.navigate("/admin/restaurant")
    }
    else if (data.role == "ROLE_SHIPPER") {
      reqData.navigate("/shipper")
    }
    else if (data.role == "ROLE_CUSTOMER") {
      reqData.navigate("/")
    }
    else {
      console.error("Unknown role:", data.role);
      reqData.navigate("/login"); // Điều hướng về trang đăng nhập nếu role không hợp lệ
    }

    dispatch({ type: LOGIN_SUCCESS, payload: data.jwt });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      payload:
        error
    });
  }
};


export const getUser = (token) => {
  return async (dispatch) => {
    dispatch({ type: GET_USER_REQUEST });
    try {
      const response = await api.get(`/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = response.data;

      dispatch({ type: GET_USER_SUCCESS, payload: user });
      console.log("req User ", user);
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const updateProfile = (req, jwt) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });
    try {
      const { data } = await api.post(`/api/users/profile/update`, req, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      dispatch({ type: GET_USER_SUCCESS, payload: data });
      console.log("updated Profile ", data);
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
    }
  };
};

export const addToFavorites = ({ restaurantId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: ADD_TO_FAVORITES_REQUEST });
    try {
      const { data } = await api.put(`api/restaurants/${restaurantId}/add-favorites`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("Add to favorites ", data)
      dispatch({ type: ADD_TO_FAVORITES_SUCCESS, payload: data });
    } catch (error) {
      console.log("catch error ", error)
      dispatch({
        type: ADD_TO_FAVORITES_FAILURE,
        payload: error.message,
      });
    }
  };
};



export const logout = () => {
  return async (dispatch) => {
    sessionStorage.clear();
    dispatch({ type: LOGOUT });

  };
};



