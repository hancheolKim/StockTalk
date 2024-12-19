import React, { useState } from "react";
import "./ProcessDefective.css"; // 필요한 CSS 파일

const ProcessDefective = ({ item, onClose, onDefectiveProcessed }) => {
  const [quantity, setQuantity] = useState(0);

  const handleProcess = async () => {
    if (quantity <= 0 || quantity > item.itemQuantity) {
      alert("처리할 수량이 올바르지 않습니다.");
      return;
    }

    try {
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/item/processDefective", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemNum: item.itemNum, quantity }),
      });

      const result = await response.json();

      if (result.message === "불량 처리 완료") {
        alert("불량 처리 완료!");
        // 아이템 수량을 업데이트
        onDefectiveProcessed(item.itemNum, quantity);
        onClose();  // 모달 닫기  
      } else {
        alert("불량 처리 실패!");
      }
    } catch (error) {
      console.error("불량 처리 중 오류 발생:", error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content3">
        <h2>불량 처리</h2>
        <p>제품코드 : {item.itemNum}</p>
        <p>이름 : {item.itemName}</p>
        <p>양품 수량 : {item.itemQuantity}</p>
        <label>
          처리할 불량 수량 : &nbsp;
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            max={item.itemQuantity} // 최대값 설정
          />{" "}
          &nbsp; 개
        </label>
        <br />
        <span className="red-text">*양품 수량 이하로 입력할 수 있습니다.</span>
        <div className="modal-actions">
          <button className="button-process" onClick={handleProcess}>
            처리
          </button>
          <button className="button-cancel" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcessDefective;
