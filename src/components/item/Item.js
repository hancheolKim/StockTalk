import React, { useEffect, useState } from "react";
import "./Item.css";

const Item = () => {
  const [items, setItems] = useState([]);

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

  return (
    <div className="container">
      <h1 className="title">상품관리 페이지</h1>
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
              <tr key={item.itemNum}>
                <td>{index + 1}</td>
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
  );
};

export default Item;
