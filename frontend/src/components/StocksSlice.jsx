import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const fetchStocks = createAsyncThunk("stocks/fetchStocks", async () => {
  const response = await axios.get(`http://localhost:3000/api/stocks/`);
  return response;
});

// export const fetchStockData = createAsyncThunk(
//   "stocks/fetchStockData",
//   async ({ stockId, duration }, { dispatch }) => {
//     let data = [];
//     let complete = false;
//     while (!complete) {
//       const response = await axios.post(
//         `http://localhost:3000/api/stocks/${stockId}`,
//         { duration }
//       );

//       console.log("stocks data",response.data);
//       data = [...data, ...response.data.entries];
//       if (response.data.status === "COMPLETE") complete = true;
//       await new Promise((r) => setTimeout(r, 2000));
//     }
//     return data;
//   }
// );
export const fetchStockData = createAsyncThunk(
  "stocks/fetchStockData",
  async ({ stockId, duration }, { dispatch }) => {
    let data = [];
    let complete = false;
    while (!complete) {
      const response = await axios.post(
        `http://localhost:3000/api/stocks/${stockId}`,
        { duration }
      );

      console.log("Stock Data Response:", response.data); // Debugging

      data = [...data, ...response.data.entries];

      if (response.data.complete) complete = true;
      await new Promise((r) => setTimeout(r, 2000));
    }
    return data;
  }
);

const stocksSlice = createSlice({
  name: "stocks",

  initialState: { stocks: [], stockData: [], loading: false },

  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
      })
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.stockData = action.payload;
        state.loading = false;
      });
  },
});

export default stocksSlice.reducer;
