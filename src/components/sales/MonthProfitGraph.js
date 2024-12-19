import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const MonthProfitGraph = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
    },
  };

  return (
    <div className="graph-container">
      <h2>월별 손익금액</h2>
      <Line data={data} options={options} height={400} width={600} />

    </div>
  );
};

export default MonthProfitGraph;
