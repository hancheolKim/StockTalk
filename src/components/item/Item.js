import React, { useEffect, useState, useCallback } from "react";
import "./Item.css";
import StockList from "./StockList";
import InOutInfo from "./InOutInfo";

const Item = () => {
  const [items, setItems] = useState([]);
  const [view, setView] = useState("productList");
  const [pageInfo, setPageInfo] = useState({});
  const [filters, setFilters] = useState({
    pageNum: 1,
    order: 1,
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
      setPageInfo({ count: data.count });
    } catch (error) {
      console.error("에러 발생:", error);
    }
  }, [filters]);

  useEffect(() => {
    console.log(pageInfo);
  }, [pageInfo]);

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

    setFilters((prev) => ({
      ...prev,
      keyfield,
      keyword,
      pageNum: 1,
    }));
  };

  const goPage = (pageNum) => {
    setFilters((prev) => ({ ...prev, pageNum }));
  };

  const handleOrderChange = (order) => {
    setFilters((prev) => ({ ...prev, order, pageNum: 1 }));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // 페이지 수 계산: totalCount가 아니라 count를 기준으로 계산
  const totalPages = pageInfo.count > 0 ? Math.ceil(pageInfo.count / 15) : 0; // count를 기준으로 계산
  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {  // totalPages는 전체 페이지 수
    pageButtons.push(
      <button
        key={i}
        onClick={() => goPage(i)}
        className={filters.pageNum === i ? "selected" : ""}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="container">
      <div className="same-line">
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
      </div>

      {view === "productList" && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>
                  상품코드
                </th>
                <th>
                  상품명
                </th>
                <th>카테고리</th>
                <th>
                  가격
                </th>
                <th>
                  수량
                </th>
                <th>
                  업데이트 날짜
                </th>
                <th>비고</th>                
              </tr>
            </thead>
            <tbody>
              {pageInfo.count > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.itemNum}</td>
                    <td>{item.itemName}</td>
                    <td>{item.categoryName}</td>
                    <td className="text-right">
                      {item.price.toLocaleString()} 원
                    </td>
                    <td>{item.itemQuantity}</td>
                    <td>{formatDate(item.itemUptDate)}</td>
                    <td>{item.itemNotes}</td>
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
          <div className="order-radio">
            <label>
              <input 
                type="radio" 
                name="order" 
                value="1" 
                onChange={() => handleOrderChange(1)} 
                checked={filters.order === 1} 
              />
              가격 낮은순
            </label>
            <label>
              <input 
                type="radio" 
                name="order" 
                value="2" 
                onChange={() => handleOrderChange(2)} 
                checked={filters.order === 2} 
              />
              가격 높은순
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
        <div className="form-container">
          <form onSubmit={handleSearch} className="search-form">
            <select name="keyfield">
              <option value="1">번호</option>
              <option value="2">이름</option>
            </select>
            <input name="keyword" placeholder="검색어 입력" />
            <button type="submit">검색</button>
          </form>
        </div>
        
      {/* 페이지 버튼 추가 */}
      {totalPages > 0 && (
        <div className="page-buttons">
          <button
            onClick={() => goPage(Math.max(1, filters.pageNum - 1))}
            disabled={filters.pageNum === 1}
          >
            이전
          </button>
          {pageButtons}
          <button
            onClick={() => goPage(Math.min(totalPages, filters.pageNum + 1))}
            disabled={filters.pageNum === totalPages}
          >
            다음
          </button>
        </div>
      )}
        </div>
      )}

      {view === "stockList" && <StockList />}
      {view === "inOutInfo" && <InOutInfo />}

    </div>
  );
};

export default Item;
