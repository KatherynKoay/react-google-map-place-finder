export const SET_SEARCH_TERM = "SET_SEARCH_TERM";
export const SET_SEARCH_RESULTS = "SET_SEARCH_RESULTS";
export const ADD_SEARCH_HISTORY = "ADD_SEARCH_HISTORY";

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term,
});

export const setSearchResults = (results) => ({
  type: SET_SEARCH_RESULTS,
  payload: results,
});

export const addSearchHistory = (search) => ({
  type: ADD_SEARCH_HISTORY,
  payload: search,
});
