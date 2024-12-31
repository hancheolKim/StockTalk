import React, { useState, useEffect } from 'react';
import ProcessDefective from './ProcessDefective.js';
import Pagination from "../../layout/Pagination.js";

const StockList = ({ setView, selectedItem, setSelectedItem }) => {
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


  const handleRadioChange = (itemId) => {
    setSelectedItem(itemId);
  };

  const deleteItem = async () => {
    if (!selectedItem) {
      alert('삭제할 항목을 선택해주세요.');
      return;
    }
    const confirmDelete = window.confirm('정말로 선택한 아이템을 삭제하시겠습니까?');
    if (!confirmDelete) {
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
        setItems(items.filter((item) => item.itemNum !== selectedItem.itemNum));
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
    <>
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
                onClick={(e) => handleRowClick(item, e)}
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

          {/* Pagination 컴포넌트 추가 */}
          {pageInfo.count > 0 && (
                <Pagination
                currentPage={filters.pageNum}
                count={pageInfo.count}
                setFilters={setFilters}
              />
              )}
      {modalOpen && selectedItem && (
        <ProcessDefective
          item={selectedItem}
          onClose={closeModal}
          onDefectiveProcessed={(itemNum, defectiveQuantity) => {
            setItems((prevItems) =>
              prevItems.map((item) => {
                if (item.itemNum === itemNum) {
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
    </>
  );
};

export default StockList;
