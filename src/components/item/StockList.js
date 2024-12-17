import React, { useState, useEffect } from 'react';
import './Item.css'; // 제공된 CSS 파일을 여기에 연결

const StockList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]); // 재고 목록을 위한 상태 추가
  const [pageInfo, setPageInfo] = useState({});
  
  const totalPages = pageInfo.count > 0 ? Math.ceil(pageInfo.count / 15) : 0;
  const [filters, setFilters] = useState({
    pageNum: 1,
    order: 1,
    category: "",
    keyfield: "",
    keyword: "",
  });
  
  useEffect(() => {
    // 데이터 가져오는 함수 (임시로 fetch로 대체)
    const fetchItems = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(
          `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/stocklist?${query}`
        );
        const data = await response.json();
        setItems(data.items); // 가져온 데이터를 상태에 저장
        setPageInfo({ count: data.count });
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchItems(); // 컴포넌트가 마운트될 때 데이터 로드
  }, [filters]); // filters 변경 시마다 실행

  const handleSearch = (e) => {
    e.preventDefault();
    const keyfield = e.target.keyfield.value;
    const keyword = e.target.keyword.value;

    setFilters((prev) => ({
      ...prev,
      keyfield,
      keyword,
      pageNum: 1, // 검색 시 페이지를 1로 초기화
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters((prev) => ({ ...prev, pageNum: page }));
  };

  const renderPageButtons = () => {
    let buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? 'selected' : ''}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="stock-list-container">
      {/* 재고 목록 테이블 */}
      <table className="table">
        <thead>
          <tr>
            <th><button>삭제</button></th>
            <th>번호</th>
            <th>이름</th>
            <th>가격</th>
            <th>수량</th>
            <th>불량수량</th>
          </tr>
        </thead>
        <tbody>
          {/* 실제 데이터를 사용하여 테이블을 동적으로 채우기 */}
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>{item.itemNum}</td>
                <td>{item.itemName}</td>
                <td>{item.price}</td>
                <td>{item.itemQuantity}</td>
                <td>{item.defectiveQuantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty-message">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* 검색 폼 */}
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

      {/* 페이지 버튼 */}
      <div className="page-buttons">
        {renderPageButtons()}
      </div>
    </div>
  );
};

export default StockList;
