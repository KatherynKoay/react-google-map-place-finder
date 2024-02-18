import { Provider } from "react-redux";
import store from "./redux/store";
import React from "react";
import AddressSelection from "./component/AddressSelection";

const App = () => {
  return (
    <Provider store={store}>
      <AddressSelection />
    </Provider>
  );
};

export default App;
