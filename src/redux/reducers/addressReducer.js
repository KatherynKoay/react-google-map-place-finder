const initialState = {
  address: "", // Initial state for the address
  searchHistory: [], // Initial state for search history
};

const addressReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ADDRESS":
      return {
        ...state,
        address: action.payload,
      };
    case "ADD_TO_SEARCH_HISTORY":
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

export default addressReducer;
