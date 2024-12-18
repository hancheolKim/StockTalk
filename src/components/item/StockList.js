import React, { useState, useEffect } from 'react';
import './Item.css'; // 제공된 CSS 파일을 여기에 연결


const StockList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]); // 재고 목록을 위한 상태 추가
  const [pageInfo, setPageInfo] = useState({});

  const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목을 추적하는 상태 추가
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
  const goPage = (pageNum) => {
    setFilters((prev) => ({ ...prev, pageNum }));
  };

 // 페이지 수 계산: count를 기준으로 계산
 const totalPages = pageInfo.count > 0 ? Math.ceil(pageInfo.count / 15) : 0;

 // 페이지 번호 버튼 범위 설정: 현재 페이지를 기준으로 앞뒤 2개 버튼만 보이도록
 const maxButtons = 5;
 const half = Math.floor(maxButtons / 2);
 let startPage = Math.max(filters.pageNum - half, 1);
 let endPage = Math.min(startPage + maxButtons - 1, totalPages);

 if (endPage - startPage < maxButtons - 1) {
   startPage = Math.max(endPage - maxButtons + 1, 1);
 }

 const pageButtons = [];
 for (let i = startPage; i <= endPage; i++) {
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

    // 라디오 버튼 클릭 시 선택된 항목을 상태에 저장
  const handleRadioChange = (itemId) => {
    setSelectedItem(itemId);
  };
  const deleteItem = async () => {
    if (!selectedItem) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
  
    const itemNum = selectedItem;
  
    try {
      const response = await fetch(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/delItem`, {
        method: 'POST', // POST 메소드 사용
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터 전송
        },
        body: JSON.stringify({ itemNum }) // itemNum을 body로 전달
      });
  
      const result = await response.json();
  
      if (result.message === 'Item deleted successfully') {
        alert('아이템이 삭제되었습니다.');
        // 아이템 삭제 후, 목록을 새로 고침
        setItems(items.filter(item => item.itemNum !== selectedItem));
        setSelectedItem(null); // 삭제 후 선택된 항목 초기화
      } else {
        alert('아이템 삭제 실패');
      }
    } catch (error) {
      console.error('아이템 삭제 중 오류 발생:', error);
      alert('아이템 삭제 중 오류가 발생했습니다.');
    }
  };
  return (
    <div className="stock-list-container">
      {/* 재고 목록 테이블 */}
      <table className="table">
        <thead>
          <tr>
             <th><button onClick={deleteItem}>삭제</button></th>
            <th>제품코드</th>
            <th>이름</th>
            <th>원가</th>
            <th>총수량</th>
            <th>양품수량</th>
            <th>불량수량</th>
          </tr>
        </thead>
        <tbody>
          {/* 실제 데이터를 사용하여 테이블을 동적으로 채우기 */}
          {pageInfo.count > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>
                  <input 
                    type="radio" 
                    name="itemRadio" // 동일한 name 속성으로 한 번에 하나만 선택되게 설정
                    checked={selectedItem === item.itemNum} // 선택된 항목에 맞게 체크 상태 관리
                    onChange={() => handleRadioChange(item.itemNum)} // 라디오 버튼 클릭 시 상태 업데이트
                  />
                </td>
                <td>{item.itemNum}</td>
                <td>{item.itemName}</td>
                <td>{item.costPrice}</td>
                <td>{item.itemQuantity + item.defectiveQuantity}</td>
                <td className={item.itemQuantity <= 3 ? 'low-quantity' : ''}>{item.itemQuantity}</td>
                <td>{item.defectiveQuantity}</td>
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
      
      {/* 검색 폼 */}
      <div className="form-container">
        <form onSubmit={handleSearch} className="search-form">
          <select name="keyfield">
            <option value="0">선택</option>
            <option value="1">번호</option>
            <option value="2">이름</option>
          </select>
          <input name="keyword" placeholder="검색어 입력" />
          <button type="submit">검색</button>
        </form>
      </div>

      {/* 페이지 버튼 */}
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
    </div>
  );
};

export default StockList;
