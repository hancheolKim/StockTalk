import React, { useEffect, useState, useCallback } from "react";
import "./Item.css";
import StockList from "./StockList"; // 재고리스트 컴포넌트 import
import InOutInfo from "./InOutInfo"; // 입출고정보 컴포넌트 import

const Item = () => {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("productList"); // 현재 보여줄 리스트 상태
  const [pageInfo, setPageInfo] = useState({}); // 페이지 정보
  const [filters, setFilters] = useState({
    pageNum: 1,
    order: 1, // 기본 정렬 방식
    category: "",
    keyfield: "",
    keyword: "",
  });

  const fetchItems = useCallback(async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/list?${query}`
      );
      if (!response.ok) {
        throw new Error("데이터를 가져오는 중 오류가 발생했습니다.");
      }
      const data = await response.json();
      setItems(data.items);
      setPageInfo({ page: data.page, count: data.count });
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleButtonClick = (viewType) => {
    setView(viewType);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const keyfield = e.target.keyfield.value;
    const keyword = e.target.keyword.value;
    setFilters((prev) => ({ ...prev, keyfield, keyword, pageNum: 1 }));
  };

  const handleOrderChange = (order) => {
    setFilters((prev) => ({ ...prev, order, pageNum: 1 }));
  };

  const handlePageChange = (pageNum) => {
    setFilters((prev) => ({ ...prev, pageNum }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="container">
      {/* 항상 보이는 버튼 그룹 */}
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

      {/* 제품리스트일 경우만 보이는 검색 폼 */}
      {view === "productList" && (
        <form onSubmit={handleSearch} className="search-form">
          <select name="keyfield">
            <option value="1">번호</option>
            <option value="2">이름</option>
          </select>
          <input name="keyword" placeholder="검색어 입력" />
          <button type="submit">검색</button>
        </form>
      )}

      {/* 제품리스트일 경우만 보이는 테이블 */}
      {view === "productList" && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleOrderChange(1)}>
                  코드 <small>▲▼</small>
                </th>
                <th onClick={() => handleOrderChange(2)}>
                  이름 <small>▲▼</small>
                </th>
                <th onClick={() => handleOrderChange(3)}>
                  가격 <small>▲▼</small>
                </th>
                <th onClick={() => handleOrderChange(4)}>
                  수량 <small>▲▼</small>
                </th>
                <th onClick={() => handleOrderChange(5)}>
                  업데이트 날짜 <small>▲▼</small>
                </th>
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

          <div
            className="pagination"
            dangerouslySetInnerHTML={{ __html: pageInfo.page }}
          />
        </div>
      )}

      {/* 선택된 뷰에 따라 다른 컴포넌트 렌더링 */}
      {view === "stockList" && <StockList />} {/* 재고리스트 컴포넌트 렌더링 */}
      {view === "inOutInfo" && <InOutInfo />} {/* 입출고정보 컴포넌트 렌더링 */}
    </div>
  );
};

export default Item;
