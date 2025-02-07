import React from "react";
// import StocksSlice from "./components/StocksSlice";

import { Provider } from "react-redux";
import store from "./components/Store";
import StockChart from "./components/StockChart";

const App = () => {
  return (
    <Provider store={store}>
      <StockChart />
    </Provider>
  );
};

export default App;
