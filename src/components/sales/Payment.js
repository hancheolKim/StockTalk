import React, { useState } from "react";
import "./Payment.css";

const Payment = () => {
  // 결제 내역 예시 데이터
  const [paymentData, setPaymentData] = useState([
    {
      id: 1,
      itemCode: "P123",
      amount: 10000,
      date: "2024-12-01",
      paymentMethod: "카드",
      notes: "배송비 포함",
    },
    {
      id: 2,
      itemCode: "P456",
      amount: 5000,
      date: "2024-12-02",
      paymentMethod: "현금",
      notes: "할인 적용",
    },
    {
      id: 3,
      itemCode: "P789",
      amount: 20000,
      date: "2024-12-03",
      paymentMethod: "카드",
      notes: "정상 결제",
    },
  ]);

  // 결제 내역 삭제 함수
  const handleDelete = (id) => {
    const updatedData = paymentData.filter((item) => item.id !== id);
    setPaymentData(updatedData);
  };

  return (
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th></th> {/* 공백란 */}
            <th>번호</th>
            <th>제품코드</th>
            <th>결제금액</th>
            <th>결제날짜</th>
            <th>결제방식</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.length > 0 ? (
            paymentData.map((payment) => (
              <tr key={payment.id}>
                <td>
                  <button
                    onClick={() => handleDelete(payment.id)}
                    className="delete-button"
                  >
                    삭제
                  </button>
                </td>
                <td>{payment.id}</td>
                <td>{payment.itemCode}</td>
                <td>{payment.amount.toLocaleString()} 원</td>
                <td>{payment.date}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.notes}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="empty-message">
                데이터가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payment;
