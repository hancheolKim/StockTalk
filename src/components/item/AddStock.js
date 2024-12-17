import React, { useState } from 'react';
import './AddStock.css'; // CSS 파일을 불러옵니다.

const AddStock = ({ onClose }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    product_code: '',
    product_name: '',
    product_cost: '',
    good_quantity: '',
    defective_quantity: '',
    registration_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleProductCodeGenerate = () => {
    const generatedCode = `P${Math.floor(Math.random() * 100000)}`;
    setFormData((prevData) => ({
      ...prevData,
      product_code: generatedCode,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('등록된 데이터:', formData);
    // 폼 데이터 초기화
    setFormData({
      category_id: '',
      product_code: '',
      product_name: '',
      product_cost: '',
      good_quantity: '',
      defective_quantity: '',
      registration_date: '',
    });
    onClose(); // 등록 후 폼 닫기
  };

  return (
    <div className="add-stock-container">
      <h2 className="add-stock-header">재고 등록</h2>
      <form onSubmit={handleSubmit} className="add-stock-form">
        <div className="add-stock-form-group">
          <label>카테고리 :</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="add-stock-select"
          >
            <option value="">선택</option>
            <option value="1">동양화</option>
            <option value="2">서양화</option>
            <option value="3">수채화</option>
            <option value="4">유화</option>
            <option value="5">판화</option>
            <option value="6">조각</option>
          </select>
        </div>

        <div className="add-stock-form-group">
          <label>제품코드 : </label>
          <input
            type="text"
            name="product_code"
            value={formData.product_code}
            readOnly
            className="add-stock-input"
          />
          <button type="button" onClick={handleProductCodeGenerate} className="add-stock-button">
            코드 생성
          </button>
        </div>

        <div className="add-stock-form-group">
          <label>제품명 : </label>
          <input
            type="text"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>제품원가 : </label>
          <input
            type="number"
            name="product_cost"
            value={formData.product_cost}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>양품수량 :</label>
          <input
            type="number"
            name="good_quantity"
            value={formData.good_quantity}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>불량수량 : </label>
          <input
            type="number"
            name="defective_quantity"
            value={formData.defective_quantity}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-form-group">
          <label>등록날짜 : </label>
          <input
            type="date"
            name="registration_date"
            value={formData.registration_date}
            onChange={handleChange}
            className="add-stock-input"
          />
        </div>

        <div className="add-stock-button-group">
          <button type="submit" className="add-stock-submit-button">등록</button>
          <button type="button" onClick={onClose} className="add-stock-close-button">닫기</button>
        </div>
      </form>
    </div>
  );
};

export default AddStock;
