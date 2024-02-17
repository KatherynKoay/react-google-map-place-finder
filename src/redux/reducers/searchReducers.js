import {
  SET_SEARCH_TERM,
  SET_SEARCH_RESULTS,
  ADD_SEARCH_HISTORY,
} from "../actions/searchActions";

const initialState = {
  searchTerm: "",
  searchResults: [],
  searchHistory: [],
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload };

    case SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };

    case ADD_SEARCH_HISTORY:
      if (action.payload !== "") {
        // Only add to searchHistory if the search term is not empty
        return {
          ...state,
          searchHistory: [
            ...state.searchHistory,
            { term: action.payload, timestamp: Date.now() },
          ],
        };
      }
      return state;

    default:
      return state;
  }
};

export default searchReducer;
