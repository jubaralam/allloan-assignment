import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const fetchStocks = createAsyncThunk("stocks/fetchStocks", async () => {
  const response = await axios.get(
    `https://allloan-assignment.onrender.com/api/stocks`
  );
  console.log("response from fetch stock", response.data);
  return response.data;
});

export const fetchStockData = createAsyncThunk(
  "stocks/fetchStockData",
  async ({ stockId, duration }, { dispatch }) => {
    console.log("Fetching stock data for:", stockId, duration);

    let data = [];
    let complete = false;
    console.log("before fetching data");
    while (!complete) {
      const response = await axios.post(
        `https://allloan-assignment.onrender.com/api/stocks/${stockId}`,
        { duration }
      );

      console.log("API Response id:", response.data.data);
      console.log("Payload Sent:", { stockId, duration });

      data = [...data, ...response.data.data];

      if (response.data.status === "COMPLETE") complete = true;
      await new Promise((r) => setTimeout(r, 2000));
    }
    console.log("after fetching data");
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
        console.log("Fetched 1 stock data:", action.payload);
        state.stocks = action.payload || [];
      })

      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.stockData = action.payload || [];
        state.loading = false;
      });
  },
});

export default stocksSlice.reducer;
