import { isPresentInFavorites } from "../../customer/component/config/logic";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT,
  ADD_TO_FAVORITES_SUCCESS,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  UPDATE_USER_REQUEST,
} from "./ActionType";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
  jwt: null,
  favorites: [],
  success: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case GET_USER_REQUEST:
    case UPDATE_USER_REQUEST:
      return { ...state, isLoading: true, error: null, success: null };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jwt: action.payload,
        success: "Register Success",
      };

    case ADD_TO_FAVORITES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        // favorites:[action.payload,...state.favorites],
        favorites: isPresentInFavorites(state.favorites, action.payload)
          ? state.favorites.filter((item) => item.id !== action.payload.id)
          : [action.payload, ...state.favorites],
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        jwt: action.payload,
        success: "Login success",
      };

    case UPDATE_USER_SUCCESS:
    case GET_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: action.payload,
        favorites: action.payload.favorites,
      };
      

    case UPDATE_USER_FAILURE:
    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case GET_USER_FAILURE:
      return { ...state, isLoading: false, error: action.payload };

    case LOGOUT:
      localStorage.removeItem("jwt");
      return { ...state, jwt: null, user: null, success: "logout success" };
    default:
      return state;
  }
};

export default authReducer;
