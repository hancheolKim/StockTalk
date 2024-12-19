import React, { useState, useEffect } from 'react';
import './Item.css';
import ProcessDefective from './ProcessDefective';

const StockList = ({ setView, selectedItem,setSelectedItem }) => {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    pageNum: 1,
    order: 1,
    category: '',
    keyfield: '',
    keyword: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const response = await fetch(
          `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/stocklist?${query}`
        );
        const data = await response.json();
        setItems(data.items);
        setPageInfo({ count: data.count });
      } catch (error) {
        console.error('데이터를 가져오는 데 실패했습니다:', error);
      }
    };

    fetchItems();
  }, [filters]);

  const handleRowClick = (item, e) => {
    // 라디오 버튼이 아닌 곳을 클릭했을 때만 모달을 열도록 조건 추가
    if (e && e.target && e.target.type !== 'radio') {
      setSelectedItem(item);
      setModalOpen(true);
    }
  };
  

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
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

  const totalPages = pageInfo.count > 0 ? Math.ceil(pageInfo.count / 15) : 0;

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
        className={filters.pageNum === i ? 'selected' : ''}
      >
        {i}
      </button>
    );
  }

  const handleRadioChange = (itemId) => {
    setSelectedItem(itemId);
  };

  const deleteItem = async () => {
    if (!selectedItem) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }

    const itemNum = selectedItem.itemNum;

    try {
      const response = await fetch(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/delItem`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ itemNum }),
        }
      );

      const result = await response.json();

      if (result.message === 'Item deleted successfully') {
        alert('아이템이 삭제되었습니다.');
        setItems(items.filter((item) => item.itemNum !== selectedItem));
        setSelectedItem(null);
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
      <table className="table">
        <thead>
          <tr>
            <th>
              <button onClick={deleteItem}>삭제</button>
            </th>
            <th>제품코드</th>
            <th>이름</th>
            <th>원가</th>
            <th>총수량</th>
            <th>양품수량</th>
            <th>불량수량</th>
          </tr>
        </thead>
        <tbody>
          {pageInfo.count > 0 ? (
            items.map((item, index) => (
                <tr
                  key={index}
                  onClick={(e) => handleRowClick(item, e)} // 이벤트 객체 e를 전달
                  className="canChange"
                >
                <td>
                  <input
                    type="radio"
                    name="itemRadio"
                    checked={selectedItem === item}
                    onChange={() => handleRadioChange(item)}
                  />
                </td>
                <td>{item.itemNum}</td>
                <td>{item.itemName}</td>
                <td>{item.costPrice}</td>
                <td>{item.itemQuantity + item.defectiveQuantity}</td>
                <td className={item.itemQuantity <= 3 ? 'low-quantity' : ''}>
                  {item.itemQuantity}
                </td>
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

      {modalOpen && selectedItem && (
        <ProcessDefective
          item={selectedItem}
          onClose={closeModal}
          onDefectiveProcessed={(itemNum, defectiveQuantity) => {
            setItems((prevItems) =>
              prevItems.map((item) => {
                if (item.itemNum === itemNum) {
                  console.log("Before Update:", item);
                  console.log("Defective Quantity:", defectiveQuantity);
                  return {
                    ...item,
                    itemQuantity: (item.itemQuantity || 0) - defectiveQuantity,
                    defectiveQuantity: (item.defectiveQuantity || 0) + defectiveQuantity,
                  };
                }
                return item;
              })
            );
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default StockList;
