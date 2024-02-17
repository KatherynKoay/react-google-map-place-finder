import React from "react";
import { StoreContext } from "./context";
import { Provider } from "react-redux";
import SearchPlace from "./component/SearchPlace"; // Adjust the import path based on your actual project structure
import store from "./redux/store"; // Assuming you have a Redux store

const App = () => {
  // Use console logs or other manual checks to test your components and Redux logic
  console.log("App component rendering...");

  // Dispatch actions to test Redux logic
  store.dispatch({ type: "SET_SEARCH_TERM", payload: "Test Search Term" });
  store.dispatch({
    type: "ADD_SEARCH_HISTORY",
    payload: "Test Search History",
  });

  return (
    <Provider>
      <StoreContext.Provider value={store}>
        <div>
          <h1>Type a place you wish to search</h1>
          <SearchPlace />
        </div>
      </StoreContext.Provider>
    </Provider>
  );
};

export default App;
