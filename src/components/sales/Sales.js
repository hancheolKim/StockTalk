import React, { useEffect, useState, useCallback } from "react";
import Pagination from "../layout/Pagination.js";
import MonthProfitGraph from "./MonthProfitGraph"; // 그래프 컴포넌트 임포트
import Payment from "./Payment";
import "./Sales.css";

// 모달 컴포넌트
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [filters, setFilters] = useState({
    pageNum: 1,
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const [view, setView] = useState("Sales"); // 선택된 뷰 상태

  const fetchSalesData = useCallback(async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `http://localhost:8080/payment/getPayList?${query}`
      );
      if (!response.ok) {
        throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setSalesData(data.items);
      setPageInfo({ count: data.count });
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  const calculateTotalProfit = () => {
    return salesData.reduce(
      (acc, sale) => acc + (sale.totalPrice - sale.totalCostPrice),
      0
    );
  };

  // 월별 손익금액 계산
  const calculateMonthlyProfit = () => {
    const monthlyProfit = {};

    salesData.forEach((sale) => {
      const month = new Date(sale.salesRegDate).toLocaleDateString("en-US", { year: 'numeric', month: 'numeric' });

      if (!monthlyProfit[month]) {
        monthlyProfit[month] = 0;
      }
      monthlyProfit[month] += sale.totalPrice - sale.totalCostPrice;
    });

    return monthlyProfit;
  };

  // 월별 손익금액을 그래프에 맞는 형식으로 변환
  const monthlyProfitData = calculateMonthlyProfit();
  const graphData = {
    labels: Object.keys(monthlyProfitData), // 월 (년-월 형식)
    datasets: [
      {
        label: "손익금액",
        data: Object.values(monthlyProfitData),
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const handleButtonClick = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="container">
      <div className="button-group-left">
        <button
          onClick={() => handleButtonClick("Sales")}
          className={view === "Sales" ? "selected" : ""}
        >
          매출기록
        </button>
        <button
          onClick={() => handleButtonClick("Payment")}
          className={view === "Payment" ? "selected" : ""}
        >
          결제내역
        </button>
      </div>

      {view === "Sales" && (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>번호</th>
                <th>제품코드</th>
                <th>판매 수량</th>
                <th>총판매금액</th>
                <th>손익금액</th>
                <th>등록일</th>
                <th>결제 유형</th>
              </tr>
            </thead>
            <tbody>
              {salesData.length > 0 ? (
                salesData.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.salesNum}</td>
                    <td>{sale.itemNum}</td>
                    <td>{sale.salesQuantity}</td>
                    <td>{sale.totalPrice.toLocaleString()} </td>
                    <td>{(sale.totalPrice - sale.totalCostPrice).toLocaleString()} </td>
                    <td>{formatDate(sale.salesRegDate)}</td>
                    <td>{sale.payType}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-message">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
              {/* 총 손익금액 표시 */}
              <tr>
                <td colSpan="7" className="totalMoney">
                  총손익금액: {calculateTotalProfit().toLocaleString()} 원
                </td>
              </tr>
            </tbody>
          </table>

          {/* 페이징 컴포넌트 */}
          {pageInfo.count > 0 && (
            <Pagination
              currentPage={filters.pageNum}
              count={pageInfo.count}
              setFilters={setFilters}
            />
          )}

          {/* 월별 손익금액 그래프 버튼 */}
          <button onClick={() => setIsModalOpen(true)} className="graph-button">
            월별 손익금액 그래프 보기
          </button>

          {/* 모달창 */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="graph-container">
              <MonthProfitGraph data={graphData} />
            </div>
          </Modal>
        </>
      )}

      {view === "Payment" && <Payment />}
    </div>
  );
};

export default Sales;
