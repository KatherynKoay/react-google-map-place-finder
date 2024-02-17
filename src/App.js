import React from "react";
//import { StoreContext } from "./context";
import { Provider } from "react-redux";
import SearchPlace from "./component/SearchPlace";
import store from "./redux/store";

const App = () => {
  console.log("App component rendering...");

  store.dispatch({ type: "SET_SEARCH_TERM", payload: "Test Search Term" });
  store.dispatch({
    type: "ADD_SEARCH_HISTORY",
    payload: "",
  });

  return (
    <Provider store={store}>
      <SearchPlace />
    </Provider>
  );
};

export default App;
