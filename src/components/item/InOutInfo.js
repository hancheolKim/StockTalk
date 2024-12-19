import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../layout/Pagination.js";

const InOutInfo = () => {
  const [itemHistory, setItemHistory] = useState([]);
  const [filters, setFilters] = useState({
    pageNum: 1,
    order: 0,  // 기본 정렬 순서
  });
   const [pageInfo, setPageInfo] = useState({});

   useEffect(() => {
    const fetchItemHistory = async () => {
      try {
        // filters를 query 파라미터로 전달하기 전에 확인
        const query = new URLSearchParams(filters).toString();  
        const response = await axios.get(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/itemHistory?${query}`);
        const { items, count } = response.data;
  
        setItemHistory(items);  // 입출고 데이터 설정
        setPageInfo({ count: count });
      } catch (error) {
        console.error("Error fetching item history:", error);
      }
    };
  
    fetchItemHistory();
  }, [filters]);  // filters 변경 시마다 호출

  const goPage = (pageNum) => {
    setFilters((prev) => ({ ...prev, pageNum }));
  };// 페이지 수 계산: count를 기준으로 계산


const handleOrderChange = (order) => {
  setFilters((prev) => {
    return { ...prev, order, pageNum: 1 };  // 페이지 번호를 1로 초기화
  });
};

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제품코드</th>
            <th>입고/출고</th>
            <th>수량</th>
            <th>입출고일</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {pageInfo.count === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>데이터가 없습니다.</td>
            </tr>
          ) : (
            itemHistory.map((item, index) => (
              <tr key={index}>
                <td>{item.historyNum}</td>
                <td>{item.itemNum}</td>
                <td>{item.transactionType==='0'?"출고":"입고"}</td>
                <td>{item.transactionQuantity}</td>
                <td>{new Date(item.transactionDate).toLocaleDateString()}</td>
                <td>{item.transactionNotes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="order-radio">
            <label>
              <input
                type="radio"
                name="order"
                value="1"
                onChange={() => handleOrderChange(1)}
                checked={filters.order === 1}
              />
              날짜 빠른순
            </label>
            <label>
              <input
                type="radio"
                name="order"
                value="2"
                onChange={() => handleOrderChange(2)}
                checked={filters.order === 2}
              />
              날짜 늦는순
            </label>
            <label>
              <input
                type="radio"
                name="order"
                value="3"
                onChange={() => handleOrderChange(3)}
                checked={filters.order === 3}
              />
              수량 많은순
            </label>
            <label>
              <input
                type="radio"
                name="order"
                value="4"
                onChange={() => handleOrderChange(4)}
                checked={filters.order === 4}
              />
              수량 적은순
            </label>
          </div>
                   {/* Pagination 컴포넌트 추가 */}
                   {pageInfo.count > 0 && (
                <Pagination
                  currentPage={filters.pageNum}
                  count={pageInfo.count}
                  onPageChange={goPage}
                />
              )}
    </div>
  );
};

export default InOutInfo;
