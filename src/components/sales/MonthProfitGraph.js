import React from "react";
import { Bar } from "react-chartjs-2"; // Bar 차트로 변경
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js의 기본 모듈을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graph = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>데이터가 없습니다</div>;
  }

  // 데이터의 월을 기준으로 날짜순으로 정렬
  const sortedData = data.sort((a, b) => {
    return new Date(a.month) - new Date(b.month); // 날짜순 정렬
  });

  // 차트 데이터 포맷 변경
  const chartData = {
    labels: sortedData.map((item) => item.month), // x축: 월
    datasets: [
      {
        label: "월별 손익",
        data: sortedData.map((item) => item.profit), // y축: 이익
        backgroundColor: "#4caf50", // 막대 색상
        borderColor: "#388e3c", // 막대 테두리 색상
        borderWidth: 1, // 막대 테두리 두께
      },
    ],
  };

  // 차트 옵션 설정
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: '월별 손익 그래프',
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `이익: ${tooltipItem.raw.toLocaleString()} 원`; // 툴팁에 이익 표시
          },
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => value.toLocaleString(), // y축 값 포맷팅
        },
      },
    },
  };

  return (
    <div className="graph-container">
      <Bar data={chartData} options={chartOptions} /> {/* Bar 차트 사용 */}
    </div>
  );
};

export default Graph;
