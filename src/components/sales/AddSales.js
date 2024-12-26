import React, { useState, useEffect } from "react";
import "./AddSales.css";

const AddSales = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userNum: "", // userNum 추가
    itemNum: "",
    salesQuantity: "",
    totalPrice: "",
    totalCostPrice: "",
    salesRegDate: "",
    payType: "",
  });
  const [itemList, setItemList] = useState([]); // 상품 리스트
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 상품 정보

  useEffect(() => {
    // 서버에서 상품 리스트 가져오기
    const fetchItemList = async () => {
      try {
        const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/getItemNumQuantityList");
        if (!response.ok) {
          throw new Error("상품 정보를 가져오는데 실패했습니다.");
        }
        const data = await response.json();
        setItemList(data.items); // items 배열: { itemNum, itemName, itemQuantity, ... }
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchItemList();
  }, []);

  const handleItemChange = (e) => {
    const selectedNum = e.target.value;
    const item = itemList.find((i) => i.itemNum === selectedNum) || null;
    setSelectedItem(item); // 선택된 상품 정보 업데이트
    setFormData((prev) => ({ ...prev, itemNum: selectedNum, salesQuantity: "", totalPrice: "", totalCostPrice: "" }));
  };

  const handleQuantityChange = (e) => {
    const quantity = e.target.value;
    if (selectedItem && quantity > selectedItem.itemQuantity) {
      alert(`판매 수량은 ${selectedItem.itemQuantity} 이하로 입력해주세요.`);
      return;
    }
    const totalPrice = quantity * selectedItem?.price || 0;
    const totalCostPrice = quantity * selectedItem?.costPrice || 0;
    setFormData((prev) => ({
      ...prev,
      salesQuantity: quantity,
      totalPrice: totalPrice,
      totalCostPrice: totalCostPrice,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.userNum ||
      !formData.itemNum ||
      !formData.salesQuantity ||
      !formData.totalPrice ||
      !formData.salesRegDate ||
      !formData.payType
    ) {
      alert("모든 필드를 입력하세요.");
      return;
    }
  
    // 서버로 데이터 전송
    try {
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/selfInsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert("결제내역 추가 성공");
      onClose(); // 모달 닫기
      window.location.reload(); // 페이지 새로고침
      } else {
        alert("서버 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("서버와의 연결에 실패했습니다:", error);
      alert("서버와의 연결에 실패했습니다.");
    }
}
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">결제 내역 추가</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form-group">
            <label className="modal-label">사용자 번호 :</label>
            <input
              type="text"
              name="userNum"
              className="modal-input"
              value={formData.userNum}
              onChange={handleChange}
              required // 필수 입력 필드로 설정
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">상품 번호 :</label>
            <select
              name="itemNum"
              className="modal-select"
              value={formData.itemNum}
              onChange={handleItemChange}
            >
              <option value="">선택</option>
              {itemList.map((item) => (
                <option key={item.itemNum} value={item.itemNum}>
                  {item.itemNum}/{item.itemName}
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
              onChange={handleQuantityChange}
              disabled={!selectedItem} // 선택된 상품이 없으면 입력 불가
            />
          </div>
          {selectedItem && (
            <div className="inventory-info">
              (현재 재고 수량: {selectedItem.itemQuantity})
            </div>
          )}

          <div className="modal-form-group">
            <label className="modal-label">판매 가격 :</label>
            <input
              type="number"
              name="totalPrice"
              className="modal-input"
              value={formData.totalPrice}
              readOnly
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">원가 :</label>
            <input
              type="number"
              name="totalCostPrice"
              className="modal-input"
              value={formData.totalCostPrice}
              readOnly
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
