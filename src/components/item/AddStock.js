import React, { useState, useEffect } from 'react';
import './AddStock.css';
import axios from 'axios';
import StockList from './StockList';

const AddStock = ({ onClose,setView }) => {
  const [formData, setFormData] = useState({
    category_name: '', // category_id 대신 category_name 사용
    product_code: '',
    product_name: '',
    product_cost: '',
    good_quantity: '',
    registration_date: '',
    item_notes: '',
  });

  const [categories] = useState([
    { id: '1', name: '동양화' },
    { id: '2', name: '서양화' },
    { id: '3', name: '수채화' },
    { id: '4', name: '유화' },
    { id: '5', name: '판화' },
    { id: '6', name: '조각' },
  ]);

  const handleCategoryChange = (e) => {
    const selectedName = categories.find((cat) => cat.id === e.target.value)?.name || '';
    setFormData((prevData) => ({
      ...prevData,
      category_name: selectedName, // category_name 저장
    }));
  };

  const handleGenerateProductCode = async () => {
    const { category_name } = formData;
    if (!category_name) {
      alert('카테고리를 먼저 선택해주세요!');
      return;
    }

    try {
      const response = await axios.post(
        `https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/generate-item-num?categoryName=${category_name}`
      );
      const { newItemNum } = response.data;
      setFormData((prevData) => ({
        ...prevData,
        product_code: newItemNum,
      }));
    } catch (error) {
      console.error('아이템 번호 생성 오류:', error);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const price = formData.product_cost * 3;

    const payload = {
      itemNum: formData.product_code,
      itemName: formData.product_name,
      costPrice: formData.product_cost,
      price: price,
      itemQuantity: formData.good_quantity,
      stockDate: formData.registration_date,
      categoryName: formData.category_name, // category_name 전달
      itemNotes: formData.item_notes,
    };

    try {
      const response = await axios.post('https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/add', payload);
      console.log('등록된 데이터:', response.data);
      alert('아이템이 성공적으로 등록되었습니다!');
      setView("stockList");
    } catch (error) {
      console.error('아이템 추가 오류:', error);
      alert('아이템 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="add-stock-container">
      <h2 className="add-stock-header">재고 등록</h2>
      <form onSubmit={handleSubmit} className="add-stock-form">
        <div className="add-stock-form-group">
          <label>카테고리 :</label>
          <select
            name="category_id"
            onChange={handleCategoryChange}
            className="add-stock-select"
          >
            <option value="">선택</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="add-stock-form-group">
          <label>제품코드 :</label>
          <input
            type="text"
            name="product_code"
            value={formData.product_code}
            readOnly
            className="add-stock-input"
          />
          <button type="button" onClick={handleGenerateProductCode} className="add-stock-button">
            코드 생성
          </button>
        </div>

        <div className="add-stock-form-group">
          <label>제품명 :</label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>제품원가 :</label>
          <input
            type="number"
            name="product_cost"
            value={formData.product_cost}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>수량 :</label>
          <input
            type="number"
            name="good_quantity"
            value={formData.good_quantity}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>등록날짜 :</label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date || getTodayDate()}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>비고 :</label>
          <textarea
            name="item_notes"
            value={formData.item_notes}
            onChange={handleChange}
            className="add-stock-textarea"
          />
        </div>

        <div className="add-stock-button-group">
          <button type="submit" className="add-stock-submit-button">
            등록
          </button>
          <button type="button" onClick={onClose} className="add-stock-close-button">
            닫기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStock;
