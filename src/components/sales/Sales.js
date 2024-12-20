import React, { useState, useEffect, useCallback } from "react";
import Pagination from "../layout/Pagination";
import Graph from "./MonthProfitGraph";
import "./Sales.css";

const Sales = () => {
  const [salesData, setSalesData] = useState([]); // 전체 데이터
  const [filteredSalesData, setFilteredSalesData] = useState([]); // 페이징된 데이터
  const [filters, setFilters] = useState({
    pageNum: 1,
  });

  // 서버에서 데이터 가져오기
  const fetchSalesData = useCallback(async () => {
    try {
      const response = await fetch(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/getPayList`
      );

      if (!response.ok) throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");

      const data = await response.json();
      setSalesData(data.items); // 전체 데이터를 상태에 저장
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, []);

  // 데이터 가져오기 실행
  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  // 클라이언트에서 페이징 처리
  useEffect(() => {
    const startIndex = (filters.pageNum - 1) * 15;
    const endIndex = startIndex + 15;
    setFilteredSalesData(salesData.slice(startIndex, endIndex));
  }, [salesData, filters.pageNum]);

  // 날짜 형식 변환 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 월별 손익 계산 (전체 데이터 기준)
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

  return (
    <div className="sales-container">
      <h2>판매 데이터</h2>

      {/* 월별 손익 그래프 */}
      <Graph data={calculateMonthlyProfit()} />

      {/* 판매 데이터 테이블 */}
      <table className="sales-table">
        <thead>
          <tr>
            <th>판매 번호</th>
            <th>상품 번호</th>
            <th>판매 수량</th>
            <th>총 가격</th>
            <th>총 이익</th>
            <th>판매 일자</th>
            <th>결제 유형</th>
          </tr>
        </thead>
        <tbody>
          {filteredSalesData.length > 0 ? (
            filteredSalesData.map((sale, index) => (
              <tr key={index}>
                <td>{sale.salesNum}</td>
                <td>{sale.itemNum}</td>
                <td>{sale.salesQuantity}</td>
                <td>{sale.totalPrice.toLocaleString()}</td>
                <td>{(sale.totalPrice - sale.totalCostPrice).toLocaleString()}</td>
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
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={filters.pageNum}
        count={salesData.length} // 전체 데이터 개수
        setFilters={setFilters}
      />
    </div>
  );
};

export default Sales;
