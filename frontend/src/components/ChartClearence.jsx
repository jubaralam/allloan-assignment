import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

const ChartClearence = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: data,
      options: {},
    });

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default ChartClearence;
