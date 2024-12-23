import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../layout/Pagination";
import Graph from "./MonthProfitGraph";
import Payment from "./Payment";
import "./Sales.css";

const Sales = () => {
  const [salesData, setSalesData] = useState([]);
  const [filters, setFilters] = useState({ pageNum: 1 });
  const [view, setView] = useState("sales"); // 초기 상태를 "sales"로 설정
  const [isGraphVisible, setIsGraphVisible] = useState(false); // 그래프 표시 상태 관리
  const [profitFilter, setProfitFilter] = useState("both"); // "both" (이익+손해), "profit", "loss"로 필터링 상태 관리

  // 서버에서 데이터 가져오기
  const fetchSalesData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/getPayList`
      );

      if (!response.ok) throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");

      const data = await response.json();
      setSalesData(data.items);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, []);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  // 페이지 데이터 계산
  const getFilteredSalesData = () => {
    const startIndex = (filters.pageNum - 1) * 15;
    return salesData.slice(startIndex, startIndex + 15);
  };

  // 월별 손익 계산
  const calculateMonthlyProfit = () => {
    const monthlyProfit = {};
    salesData.forEach((sale) => {
      const month = new Date(sale.salesRegDate).toISOString().slice(0, 7);
      const profit = sale.totalPrice - sale.totalCostPrice;

      if (!monthlyProfit[month]) {
        monthlyProfit[month] = 0;
      }
      monthlyProfit[month] += profit;
    });

    return Object.entries(monthlyProfit).map(([month, profit]) => ({
      month,
      profit,
    }));
  };

  // 그래프 보기 토글
  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible);
  };

  // 라디오 버튼 클릭 핸들러
  const handleProfitFilterChange = (e) => {
    setProfitFilter(e.target.value);
  };

  // 이익/손해 필터링된 데이터
  const getFilteredProfitData = () => {
    if (profitFilter === "profit") {
      return salesData.filter((sale) => sale.totalPrice > sale.totalCostPrice);
    } else if (profitFilter === "loss") {
      return salesData.filter((sale) => sale.totalPrice < sale.totalCostPrice);
    } else {
      return salesData; // both일 경우 필터링 없이 모든 데이터를 표시
    }
  };

  const handleButtonClick = (viewName) => {
    setView(viewName);
  };

  return (
    <div className="sales-container">
      {/* 버튼 그룹 */}
      <div className="same-line">
        <div className="button-group-left">
          <button
            onClick={() => handleButtonClick("sales")}
            className={view === "sales" ? "selected" : ""}
          >
            매출기록
          </button>
          <button
            onClick={() => handleButtonClick("payment")}
            className={view === "payment" ? "selected" : ""}
          >
            결제내역
          </button>
        </div>
      </div>

      {/* 판매 데이터 테이블 */}
      {view === "sales" && (
        <>
          {/* 월별 손익 보기 버튼 */}
          <button onClick={toggleGraphVisibility} className="graph-button">
            월별 손익금액 보기
          </button>

          {/* 그래프 모달 */}
          {isGraphVisible && (
            <Graph
              data={calculateMonthlyProfit()}
              onClose={toggleGraphVisibility}
            />
          )}

          {/* 이익/손해 필터링 라디오 버튼 */}
          <div className="profit-filter">
            <label>
              <input
                type="radio"
                value="both"
                checked={profitFilter === "both"}
                onChange={handleProfitFilterChange}
              />
              이익 + 손해
            </label>
            <label>
              <input
                type="radio"
                value="profit"
                checked={profitFilter === "profit"}
                onChange={handleProfitFilterChange}
              />
              이익만
            </label>
            <label>
              <input
                type="radio"
                value="loss"
                checked={profitFilter === "loss"}
                onChange={handleProfitFilterChange}
              />
              손해만
            </label>
          </div>

          {/* 판매 데이터 테이블 */}
          <table className="table">
            <thead>
              <tr>
                <th>판매 번호</th>
                <th>상품 번호</th>
                <th>판매 수량</th>
                <th>총 이익</th>
                <th>판매 가격</th>
                <th>판매 일자</th>
                <th>결제 유형</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredSalesData()
                .filter((sale) => {
                  const profit = sale.totalPrice - sale.totalCostPrice;
                  if (profitFilter === "profit") {
                    return profit > 0;
                  } else if (profitFilter === "loss") {
                    return profit < 0;
                  }
                  return true; // "both"일 경우 모든 데이터를 표시
                })
                .map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.salesNum}</td>
                    <td>{sale.itemNum}</td>
                    <td>{sale.salesQuantity}</td>
                    <td>{(sale.totalPrice - sale.totalCostPrice).toLocaleString()}</td>
                    <td>{sale.totalPrice.toLocaleString()}</td>
                    <td>{new Date(sale.salesRegDate).toLocaleDateString("ko-KR")}</td>
                    <td>{sale.payType}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Pagination
            currentPage={filters.pageNum}
            count={salesData.length}
            setFilters={setFilters}
          />
        </>
      )}

      {/* 재고리스트 (payment) 뷰 */}
      {view === "payment" && <Payment />}
    </div>
  );
};

export default Sales;
