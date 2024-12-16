import React, { useState } from "react";
import "./Perchase.css"; // 모달 스타일을 위한 CSS
import * as PortOne from "@portone/browser-sdk/v2";

const Perchase = ({ item, closeModal }) => {
  const [quantity, setQuantity] = useState(1);

  if (!item) return null;

  const handleQuantityChange = (e) => {
    const newQuantity = Math.min(Math.max(1, e.target.value), item.itemQuantity);
    setQuantity(newQuantity);
  };

  const handlePayment = async () => {
    try {
      const response = await PortOne.requestPayment({
        storeId: "store-3f9ebc91-a91b-4783-8f05-da9c39896c3a",
        channelKey: "channel-key-08beca98-f344-4692-9edc-78c5b0006ee7",
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: item.itemName,
        totalAmount: item.price * quantity,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
      });

      console.log(response);

      if (response.code !== undefined) {
        return alert(response.message); // 오류 메시지 출력
      }

      // 결제 성공 시 백엔드로 결제 정보를 전송
      const notified = await fetch("http://localhost:8080/payment/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "PortOne utFxMAsGVKNYWxXKECqU3WTkGrwnLnSjLuHbrhtds3MxieauTc9YSzEuxaycVPHAxl2DHGJnTiEkKdBS", // 여기에 인증 헤더 추가
        },
        body: JSON.stringify({
          paymentId: response.paymentId,  // 결제 ID
          orderName: item.itemName,       // 상품명
          totalAmount: item.price * quantity, // 가격 * 수량
          order: item.itemId,             // 주문 ID (여기서 전달해야 할 필드)
        }),
      });

      const result = await notified.json();
      if (result.result === "success") {
        alert("결제가 완료되었습니다.");
        closeModal();
      } else {
        alert("결제 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("결제 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>상품 결제</h2>
        <p><strong>상품명:</strong> {item.itemName}</p>
        <p><strong>가격:</strong> {item.price.toLocaleString()} 원</p>
        <div>
          <strong>수량:</strong>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <span className="perchase-quantity">({item.itemQuantity}개까지 선택 가능)</span>
        </div>
        <span className="red-text">*최대 수량 이하로 입력하세요.</span>

        <div>
          <button onClick={handlePayment}>결제하기</button>
          <button onClick={closeModal} className="close">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Perchase;
