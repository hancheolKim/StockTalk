import React from "react";

const StockList = () => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>상품명</th>
            <th>현재 재고</th>
            <th>입고일</th>
            <th>출고일</th>
          </tr>
        </thead>
        <tbody>
          {/* 재고리스트 데이터를 렌더링 */}
        </tbody>
      </table>
    </div>
  );
};

export default StockList;
