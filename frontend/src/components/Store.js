import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "./StocksSlice";

const store = configureStore({
  reducer: {
    stocks: stocksReducer,
  },
});
export default store;
