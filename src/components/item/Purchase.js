import React, { useState } from "react";
import "./Purchase.css"; // 모달 스타일을 위한 CSS
import * as PortOne from "@portone/browser-sdk/v2";

const Purchase = ({ item, closeModal }) => {
  // 수량 상태 관리
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

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
      // 현재 시각을 기준으로 3시간 후 만료 설정
      const validHours = 3; // 예: 3시간 후 만료 기한
      const dueDate = new Date(); // 특정 날짜로 설정할 경우
  
      // validHours를 설정하려면
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + validHours);
      const validHoursString = expirationDate.toISOString(); // ISO 형식으로 변환
  
      // 또는, dueDate를 설정하려면
      // const dueDateString = "20241231"; // YYYYMMDD 형식
      // const dueDateString = "2024-12-31"; // YYYY-MM-DD 형식
      // const dueDateString = "2024-12-31 15:00:00"; // YYYY-MM-DD HH:mm:ss 형식
  
      const response = await PortOne.requestPayment({
        storeId: "store-3f9ebc91-a91b-4783-8f05-da9c39896c3a", // 고객사 storeId로 변경
        paymentId: `payment-${crypto.randomUUID()}`,
        orderName: item.itemName, // 상품명
        totalAmount: item.price * quantity, // 총 금액
        currency: "CURRENCY_KRW",
        channelKey: "channel-key-86c5c97a-6f3c-45db-8b06-73b316d1788f", // 채널 키
        payMethod: "VIRTUAL_ACCOUNT",
  
        // 가상계좌 관련 파라미터 추가
        virtualAccount: {
          // validHours 예시
          accountExpiry: {
            validHours: validHours, // 또는 validHoursString으로 설정
            // dueDate: dueDateString // 또는 dueDate로 설정
          },
          bankCode: "KOOKMIN_BANK", // 예시: 은행 코드
          accountHolderName: "김한철", // 계좌 소유자 이름
          accountHolderBirthday: "980518", // 계좌 소유자 생년월일 (YYYYMMDD 형식)
        },
      });
  
      // 결제 처리 후의 로직
      if (response.code !== undefined) {
        alert(response.message); // 오류 메시지 출력
        return;
      }
  
      // 결제 성공 후 백엔드 처리
      const userNum = localStorage.getItem("userNum");
      const userId = localStorage.getItem("userId");
  
      const notified = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/payment/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "PortOne utFxMAsGVKNYWxXKECqU3WTkGrwnLnSjLuHbrhtds3MxieauTc9YSzEuxaycVPHAxl2DHGJnTiEkKdBS", // 인증 헤더
        },
        body: JSON.stringify({
          paymentId: response.paymentId,
          itemNum: item.itemNum, // 상품 번호
          totalPrice: item.price * quantity, // 총 가격
          totalCostPrice: item.costPrice * quantity, // 원가 총액
          salesQuantity: quantity, // 수량
          payType: "Easy_Pay",
          userNum,
          userId,
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
        <div className="align-left">
          <p><strong>상품명 : </strong> {item.itemName}</p>
          <p><strong>가격 : </strong> {item.price.toLocaleString()} 원</p>
          <div>
            <strong>수량 : </strong>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur} // 포커스가 벗어날 때 처리
              className="quantity-input"
            /> 개
            <span className="perchase-quantity"> ({item.itemQuantity}개까지 선택 가능)</span>
          </div>
          <span className="red-text">*최대 수량 이하로 입력하세요.</span>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 오류 메시지 표시 */}
        <hr />
        <div className="align-left">
          <strong>총 금액 : {(item.price * quantity).toLocaleString()}원</strong>
        </div>
        <div>
          <button onClick={handlePayment} className="perchase-button">결제하기</button>
          <button onClick={closeModal} className="close perchase-button">닫기</button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
