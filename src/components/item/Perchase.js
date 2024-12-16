import React, { useState } from "react";
import "./Perchase.css"; // 모달 스타일을 위한 CSS
import * as PortOne from "@portone/browser-sdk/v2";

const Perchase = ({ item, closeModal }) => {
  // 수량 상태 관리
  const [quantity, setQuantity] = useState(1);

  if (!item) return null; // item이 없으면 모달을 렌더링하지 않음

  const handleQuantityChange = (e) => {
    const value = e.target.value;
  
    // 빈 값 허용
    if (value === "") {
      setQuantity("");
      return;
    }
  
    // 숫자로 변환하여 검증
    const newQuantity = Math.min(Math.max(1, Number(value)), item.itemQuantity);
    setQuantity(newQuantity);
  };
  
  // 포커스가 벗어났을 때 기본값 설정
  const handleQuantityBlur = () => {
    if (quantity === "" || quantity < 1) {
      setQuantity(1); // 기본값
    }
  };

  const handlePayment = async () => {
    try {
      const response = await PortOne.requestPayment({
        storeId: "store-3f9ebc91-a91b-4783-8f05-da9c39896c3a",
        channelKey: "channel-key-08beca98-f344-4692-9edc-78c5b0006ee7",
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: item.itemName,
        totalAmount: item.price * quantity, // 가격 * 수량
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY", // 결제 방법 
        redirectUrl: "https://hancheolkim.github.io/react_real/#/item"
      });
  
      console.log(response);
  
      // 결제 실패 시 처리
      if (response.code !== undefined) {
        return alert(response.message); // 오류 메시지 출력
      }
  
      // 로컬스토리지에서 사용자 정보 가져오기
      const userNum = localStorage.getItem("userNum");
      const userId = localStorage.getItem("userId");
  
      // 결제 성공 시, 백엔드로 결제 정보 및 사용자 정보 전달
      const notified = await fetch(`https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "PortOne utFxMAsGVKNYWxXKECqU3WTkGrwnLnSjLuHbrhtds3MxieauTc9YSzEuxaycVPHAxl2DHGJnTiEkKdBS", // 여기에 인증 헤더 추가
        },
        body: JSON.stringify({
          paymentId: response.paymentId,  // 결제 ID
          orderName: item.itemName,       // 상품명
          totalAmount: item.price * quantity, // 가격 * 수량
          totalCostPrice: item.CostPrice * quantity, // 원가 * 수량
          quantity : quantity, // 수량
          payType: response.payMethod,
          userNum, // 사용자 번호 추가
          userId,  // 사용자 ID 추가
        }),
      });
  
      const result = await notified.json();
      if (result.success) {
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
            onBlur={handleQuantityBlur} // 포커스가 벗어날 때 처리
            className="quantity-input"
            />
          <span className="perchase-quantity">({item.itemQuantity}개까지 선택 가능)</span>
        </div>
        <span className="red-text">*최대 수량 이하로 입력하세요.</span>

        <div>
          <button onClick={handlePayment} className="perchase-button">결제하기</button>
          <button onClick={closeModal} className="close perchase-button">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Perchase;
