import React from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale, // 추가
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale, // 추가
  BarElement,
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
        text: "월별 손익금액",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="graph-container">
      <h2>월별 손익금액 및 추세</h2>
      <Chart type="bar" data={data} options={options} height={400} width={600} />
    </div>
  );
};

 
export default MonthProfitGraph;
