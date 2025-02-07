import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockData, fetchStocks } from "./StocksSlice";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import ChartClearence from "./ChartClearence";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const StockChart = () => {
  const dispatch = useDispatch();

  //redux state
  const { stocks, stockData, loading } = useSelector((state) => state.stocks);

  console.log("stocks", stocks);
  console.log("stock data", stockData);
  // local state for selected stock & duration
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(fetchStocks());
    }
  }, [dispatch, stocks]);

  const handleStockChange = (e) => {
    const newStock = e.target.value;
    setSelectedStock(newStock);
    setSelectedDuration(""); // Reset duration
  };
  // handle duration selection & fetch stock data
  const handleDurationChange = (e) => {
    const duration = e.target.value;
    setSelectedDuration(duration);
    if (selectedStock) {
      dispatch(fetchStockData({ stockId: selectedStock, duration }));
    }
  };

  //prepare chart data

  const chartData = {
    labels: stockData?.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Stock Price",
        data: stockData?.map((entry) => entry.price), // Correct key
        fill: false,
        borderColor: "rgb(75,192,192)",
        tension: 0.1,
      },
    ],
  };

  console.log("chart data", chartData);
  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>Stock Chart</h2>

      {/* stock dropdown */}
      <FormControl fullWidth>
        <InputLabel>Select Stock</InputLabel>
        <Select value={selectedStock} onChange={handleStockChange}>
          {Array.isArray(stocks)
            ? stocks?.map((stock) => (
                <MenuItem key={stock.id} value={stock.id}>
                  {stock.name}
                </MenuItem>
              ))
            : "Loading..."}
        </Select>
      </FormControl>

      {/* duration dropdown */}
      {selectedStock && (
        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel>Select duration</InputLabel>
          <Select value={selectedDuration} onChange={handleDurationChange}>
            {stocks
              .find((stock) => stock.id === selectedStock)
              ?.available?.map((duration) => (
                <MenuItem key={duration} value={duration}>
                  {" "}
                  {duration}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}

      {/* Show Loading or Cahrt */}
      {loading ? (
        <CircularProgress style={{ marginTop: "30px" }} />
      ) : (
        selectedStock &&
        selectedDuration &&
        stockData.length > 0 && <Line data={chartData} />
      )}
    </div>
  );
};

export default StockChart;
