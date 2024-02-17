export const SET_SEARCH_TERM = "SET_SEARCH_TERM";
export const ADD_SEARCH_HISTORY = "ADD_SEARCH_HISTORY";

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});

export const addSearchHistory = (search) => ({
  type: ADD_SEARCH_HISTORY,
  payload: search,
});
