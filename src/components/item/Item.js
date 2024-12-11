import React, { useEffect, useState } from "react";
import "./Item.css";
import StockList from "./StockList";  // 재고리스트 컴포넌트 import
import InOutInfo from "./InOutInfo"; // 입출고정보 컴포넌트 import

const Item = () => {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("productList");  // 현재 보여줄 리스트 상태

  const fetchItems = async () => {
    try {
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/list");
      if (!response.ok) {
        throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("에러 발생:", error);
    }
  };

  // 날짜를 'YYYY-MM-DD' 형식으로 변환하는 함수
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(); // 기본적으로 로컬 형식으로 날짜를 변환
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // 버튼 클릭 시 보여줄 컴포넌트를 설정하는 함수
  const handleButtonClick = (viewType) => {
    setView(viewType);
  };

  return (
    <div className="container">
      <div className="button-group">
        <button
          onClick={() => handleButtonClick("productList")}
          className={view === "productList" ? "selected" : ""}
        >
          제품리스트
        </button>
        <button
          onClick={() => handleButtonClick("stockList")}
          className={view === "stockList" ? "selected" : ""}
        >
          재고리스트
        </button>
        <button
          onClick={() => handleButtonClick("inOutInfo")}
          className={view === "inOutInfo" ? "selected" : ""}
        >
          입출고정보
        </button>
      </div>

      {/* 현재 선택된 view에 따라 다른 컴포넌트를 렌더링 */}
      {view === "productList" && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>번호</th>
                <th>이름</th>
                <th>가격</th>
                <th>수량</th>
                <th>업데이트 날짜</th>
                <th>비고</th>
                <th>카테고리</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemNum}</td>
                    <td>{item.itemName}</td>
                    <td className="text-right">
                      {item.price.toLocaleString()} 원
                    </td>
                    <td>{item.itemQuantity}</td>
                    <td>{formatDate(item.itemUptDate)}</td>
                    <td>{item.itemNotes}</td>
                    <td>{item.categoryName}</td>
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
        </div>
      )}

      {view === "stockList" && <StockList />} {/* 재고리스트 컴포넌트 렌더링 */}
      {view === "inOutInfo" && <InOutInfo />} {/* 입출고정보 컴포넌트 렌더링 */}
    </div>
  );
};

export default Item;
