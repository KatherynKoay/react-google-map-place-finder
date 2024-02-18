export const setAddress = (address) => ({
  type: "SET_ADDRESS",
  payload: address,
});

export const addToSearchHistory = (searchData) => {
  return {
    type: "ADD_TO_SEARCH_HISTORY",
    payload: searchData,
  };
};
