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

const StockChart = () => {
  const dispatch = useDispatch();

  //redux state
  const { stocks, stockData, loading } = useSelector((state) => state.stocks);

  // local state for selected stock & duration
  const [selectedStock, setSelectedStock] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  useEffect(() => {
    dispatch(fetchStocks());
  }, [dispatch]);

  // handle stock selection
  const handleStockChange = (e) => {
    setSelectedStock(e.target.value);
    setSelectedDuration(""); // Corrected
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

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h2>Stock Chart</h2>

      {/* stock dropdown */}
      <FormControl fullWidth>
        <InputLabel>Select Stock</InputLabel>
        <Select value={selectedStock} onChange={handleStockChange}>
          {stocks?.map((stock) => (
            <MenuItem key={stock.id} value={stock.id}>
              {stock.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* duration dropdown */}
      {selectedStock && (
        <FormControl fullWidth style={{ marginTop: "10px" }}>
          <InputLabel>Select duration</InputLabel>
          <Select value={selectedDuration} onChange={handleDurationChange}>
            {stocks
              .find((stock) => stock.id === selectedStock)
              ?.available_durations.map((duration) => (
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
        <CircularProgress style={{ marginTop: "20px" }} />
      ) : (
        selectedStock &&
        selectedDuration &&
        stockData.length > 0 && <Line data={chartData} />
      )}
    </div>
  );
};

export default StockChart;
