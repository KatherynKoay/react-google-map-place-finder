import { SET_ADDRESS, ADD_TO_SEARCH_HISTORY } from "../actions/actionTypes";

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: address,
});

export const addToSearchHistory = (term) => ({
  type: ADD_TO_SEARCH_HISTORY,
  payload: term,
});
