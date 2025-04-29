import { api } from "../../../customer/component/config/api";
import { CREATE_REVIEW_FOOD_FAILURE, CREATE_REVIEW_FOOD_REQUEST, CREATE_REVIEW_FOOD_SUCCESS, GET_ITEM_BY_ID_FAILURE, GET_ITEM_BY_ID_REQUEST, GET_ITEM_BY_ID_SUCCESS } from "./ActionType";
import {
  createMenuItemFailure,
  createMenuItemRequest,
  createMenuItemSuccess,
  deleteMenuItemFailure,
  deleteMenuItemRequest,
  deleteMenuItemSuccess,
  getMenuItemsByRestaurantIdFailure,
  getMenuItemsByRestaurantIdRequest,
  getMenuItemsByRestaurantIdSuccess,
} from "./ActionCreators";
import {
  DELETE_MENU_ITEM_FAILURE,
  DELETE_MENU_ITEM_REQUEST,
  DELETE_MENU_ITEM_SUCCESS,
  SEARCH_MENU_ITEM_FAILURE,
  SEARCH_MENU_ITEM_REQUEST,
  SEARCH_MENU_ITEM_SUCCESS,
  UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
  UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST,
  UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS,
} from "./ActionType";

// localhost:5454/api/admin/ingredients/food/16

export const createMenuItem = ({ menu, jwt }) => {
  return async (dispatch) => {
    dispatch(createMenuItemRequest());
    try {
      const { data } = await api.post("api/admin/foods", menu,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
      console.log("created menu ", data);
      dispatch(createMenuItemSuccess(data));
    } catch (error) {
      console.log("catch error ", error);
      dispatch(createMenuItemFailure(error));
    }
  };
};

export const createReviewFood = (req) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_REVIEW_FOOD_REQUEST });
    try {
      const { data } = await api.post("api/review/create", req.review,
        {
          headers: {
            Authorization: `Bearer ${req.jwt}`,
          },
        });
      console.log("created review ", data);
      dispatch({ type: CREATE_REVIEW_FOOD_SUCCESS, payload: data });
    } catch (error) {
      console.log("catch error ", error);
      dispatch({ type: CREATE_REVIEW_FOOD_FAILURE, payload: error });
    }
  };
};

export const getMenuItemsByRestaurantId = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByRestaurantIdRequest());
    try {
      const { data } = await api.get(
        `/api/foods/restaurant/${reqData.restaurantId}`

      );
      console.log("menu item by restaurants ", data);
      dispatch(getMenuItemsByRestaurantIdSuccess(data));
    } catch (error) {
      dispatch(getMenuItemsByRestaurantIdFailure(error));
    }
  };
};

export const getMenuItemsByFoodId = (reqData) => {
  return async (dispatch) => {
    dispatch({ type: GET_ITEM_BY_ID_REQUEST });
    try {
      const { data } = await api.get(
        `/api/foods/${reqData.foodId}`
      );
      console.log("menu item by foodId ", data);
      dispatch({ type: GET_ITEM_BY_ID_SUCCESS, payload: data });
    } catch (error) {
      console.log("error get item by foodId: ", error)
      dispatch({ type: GET_ITEM_BY_ID_FAILURE, payload: error });
    }
  };
};

export const searchMenuItem = ({ keyword, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: SEARCH_MENU_ITEM_REQUEST });
    try {
      const { data } = await api.get(`api/foods/search?name=${keyword}`);
      console.log("data ----------- ", data);
      dispatch({ type: SEARCH_MENU_ITEM_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: SEARCH_MENU_ITEM_FAILURE });
    }
  };
};

export const getAllIngredientsOfMenuItem = (reqData) => {
  return async (dispatch) => {
    dispatch(getMenuItemsByRestaurantIdRequest());
    try {
      const { data } = await api.get(
        `api/foods/restaurant/${reqData.restaurantId}`
      );
      console.log("menu item by restaurants ", data);
      dispatch(getMenuItemsByRestaurantIdSuccess(data));
    } catch (error) {
      dispatch(getMenuItemsByRestaurantIdFailure(error));
    }
  };
};

export const updateMenuItemsAvailability = ({ foodId, jwt }) => {
  return async (dispatch) => {
    dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_REQUEST });
    try {
      const { data } = await api.put(`/api/admin/foods/${foodId}`, {}, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("update menuItems Availability ", data);
      dispatch({ type: UPDATE_MENU_ITEMS_AVAILABILITY_SUCCESS, payload: data });
    } catch (error) {
      console.log("error ", error)
      dispatch({
        type: UPDATE_MENU_ITEMS_AVAILABILITY_FAILURE,
        payload: error,
      });
    }
  };
};

export const deleteFoodAction = ({ foodId, jwt }) => async (dispatch) => {
  dispatch({ type: DELETE_MENU_ITEM_REQUEST });
  try {
    const { data } = await api.delete(`/api/admin/foods/${foodId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("delete food ", data);
    dispatch({ type: DELETE_MENU_ITEM_SUCCESS, payload: foodId });
  } catch (error) {
    dispatch({ type: DELETE_MENU_ITEM_FAILURE, payload: error });
  }
};
