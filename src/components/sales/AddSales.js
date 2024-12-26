import React, { useState } from "react";
import "./AddSales.css";

const AddSales = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    itemNum: "",
    salesQuantity: "",
    totalPrice: "",
    totalCostPrice: "",
    salesRegDate: "",
    payType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.itemNum ||
      !formData.salesQuantity ||
      !formData.totalPrice ||
      !formData.salesRegDate ||
      !formData.payType
    ) {
      alert("모든 필드를 입력하세요.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">결제 내역 추가</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">상품 번호 :</label>
            <input
              type="text"
              name="itemNum"
              className="modal-input"
              value={formData.itemNum}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">판매 수량 :</label>
            <input
              type="number"
              name="salesQuantity"
              className="modal-input"
              value={formData.salesQuantity}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">판매 가격 :</label>
            <input
              type="number"
              name="totalPrice"
              className="modal-input"
              value={formData.totalPrice}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">원가 :</label>
            <input
              type="number"
              name="totalCostPrice"
              className="modal-input"
              value={formData.totalCostPrice}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">판매 일자 :</label>
            <input
              type="date"
              name="salesRegDate"
              className="modal-input"
              value={formData.salesRegDate}
              onChange={handleChange}
            />
          </div>
          <div className="modal-form-group">
            <label className="modal-label">결제 유형 :</label>
            <select
              name="payType"
              className="modal-select"
              value={formData.payType}
              onChange={handleChange}
            >
              <option value="">선택</option>
              <option value="카드">카드</option>
              <option value="현금">현금</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="submit" className="modal-button modal-button-save">
              저장
            </button>
            <button
              type="button"
              className="modal-button modal-button-cancel"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSales;
