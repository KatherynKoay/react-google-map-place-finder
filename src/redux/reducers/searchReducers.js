import { SET_SEARCH_TERM, ADD_SEARCH_HISTORY } from "../actions/searchActions";

const initialState = {
  searchTerm: "",
  searchHistory: [],
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    case ADD_SEARCH_HISTORY:
      return {
        ...state,
        searchHistory: [
          ...state.searchHistory,
          { term: action.payload, timestamp: Date.now() },
        ],
      };

    default:
      return state;
  }
};

export default searchReducer;
