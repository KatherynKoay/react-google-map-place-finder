import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import searchReducer from "./reducers/searchReducer";

const store = createStore(searchReducer, applyMiddleware(thunk));

export default store;
