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

const Graph = ({ data, onClose }) => {
  if (!data || data.length === 0) {
    return <div>데이터가 없습니다</div>;
  }

  // 데이터의 월을 기준으로 날짜순으로 정렬
  const sortedData = data.sort((a, b) => {
    return new Date(a.month) - new Date(b.month); // 날짜순 정렬
  });

  // 차트 데이터 포맵핑
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
    maintainAspectRatio: false, // 고정 비율을 사용하지 않도록 설정
    aspectRatio: 1.5, // 세로 비율을 줄여서 차트를 더 낮게 설정
    plugins: {
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
          stepSize: 2000, // 세로축 단위를 2000으로 설정
          callback: (value) => value.toLocaleString(), // y축 값 포맷팅
        },
      },
    },
  };

  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-title">월별 손익 그래프</div>
        </div>
        <div className="chart-container">
          <Bar data={chartData} options={chartOptions} /> {/* Bar 차트 사용 */}
        </div>
        <button onClick={onClose} className="close-btn">닫기</button>
      </div>
    </div>
  );
};

export default Graph;
