import React from "react";
import { Provider } from "react-redux";
import AddressSelection from "./component/AddressSelection";
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
      <AddressSelection />
    </Provider>
  );
};

export default App;
