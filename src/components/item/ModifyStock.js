import React, { useState, useEffect } from 'react';
import './AddStock.css'; // AddStock과 동일한 스타일 사용

const ModifyStock = ({ selectedItem, setView }) => {
  const [formData, setFormData] = useState({
    itemNum: selectedItem.itemNum,  // product_code -> itemNum
    itemName: selectedItem.itemName,  // product_name -> itemName
    costPrice: selectedItem.costPrice,  // product_cost -> costPrice
    itemQuantity: selectedItem.itemQuantity,  // good_quantity -> itemQuantity
    stockDate: selectedItem.stockDate,  // registration_date -> stockDate
    itemNotes: selectedItem.itemNotes,  // item_notes -> itemNotes
  });

  useEffect(() => {
    // 부모 컴포넌트로부터 받은 초기 값으로 formData를 설정
    setFormData({
      itemNum: selectedItem.itemNum,
      itemName: selectedItem.itemName,
      costPrice: selectedItem.costPrice,
      itemQuantity: selectedItem.itemQuantity,
      defectiveQuantity : selectedItem.defectiveQuantity,
      stockDate: selectedItem.stockDate,
      itemNotes: selectedItem.itemNotes,
    });
  }, [selectedItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = formData.costPrice * 3;

    const payload = {
      itemNum: formData.itemNum,
      itemName: formData.itemName,
      costPrice: formData.costPrice,
      price: formData.costPrice * 3,
      itemQuantity: formData.itemQuantity,
      defectiveQuantity : formData.defectiveQuantity,
      stockDate: formData.stockDate,
      itemNotes: formData.itemNotes,
    };

    try {
      const response = await fetch(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/modify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (result.success) {
        alert('아이템이 성공적으로 수정되었습니다!');
        setView("stockList");
      } else {
        alert('아이템 수정 실패');
      }
    } catch (error) {
      console.error('아이템 수정 오류:', error);
      alert('아이템 수정 중 오류가 발생했습니다.');
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="add-stock-container">
      <h2 className="add-stock-header">재고 수정</h2>
      <form onSubmit={handleSubmit} className="add-stock-form">
        <div className="add-stock-form-group">
          <label>제품코드 : </label>
          <input
            type="text"
            name="itemNum"
            value={formData.itemNum}
            readOnly
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>제품명 : </label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            readOnly
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>제품원가 : </label>
          <input
            type="number"
            name="costPrice"
            value={formData.costPrice}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>양품수량 : </label>
          <input
            type="number"
            name="itemQuantity"
            value={formData.itemQuantity}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>불량수량 : </label>
          <input
            type="number"
            name="defectiveQuantity"
            value={formData.defectiveQuantity}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>등록날짜 : </label>
          <input
            type="date"
            name="stockDate"
            value={getTodayDate()}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>비고 : </label>
          <textarea
            name="itemNotes"
            value={formData.itemNotes}
            onChange={handleChange}
            className="add-stock-textarea"
          />
        </div>

        <div className="add-stock-button-group">
          <button type="submit" className="add-stock-submit-button">
            수정
          </button>
          <button type="button" onClick={() => setView("stockList")} className="add-stock-close-button">
            닫기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyStock;
