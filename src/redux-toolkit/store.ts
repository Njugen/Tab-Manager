import { configureStore } from "@reduxjs/toolkit";
import { combinedReducers } from "../redux/reducers";

const store = configureStore({
    reducer: combinedReducers
});

export default store;