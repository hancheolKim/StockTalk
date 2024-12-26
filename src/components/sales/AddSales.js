import React, { useState, useEffect } from "react";
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
  const [itemList, setItemList] = useState([]); // 상품 번호 리스트 상태

  useEffect(() => {
    // 서버에서 상품 번호 리스트 가져오기
    const fetchItemList = async () => {
      try {
        const response = await fetch("http://localhost:8080/payment/getItemNumList");
        if (!response.ok) {
          throw new Error("상품 번호를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setItemList(data.items); // items 배열 설정
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchItemList();
  }, []);

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
            <select
              name="itemNum"
              className="modal-select"
              value={formData.itemNum}
              onChange={handleChange}
            >
              <option value="">선택</option>
              {itemList.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
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
              <option value="Card">카드</option>
            <option value="Cash">현금</option>
            <option value="Credit">외상금 납입</option>
            <option value="BankTransfer">은행 송금</option>
            <option value="GiftCard">상품권</option>
            <option value="MobilePayment">모바일 결제</option>
            <option value="Check">수표</option>
            <option value="Other">기타</option>
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
