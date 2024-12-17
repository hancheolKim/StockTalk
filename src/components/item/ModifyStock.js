import React from 'react';

const ModifyStock = ({ item, onClose }) => {
  return (
    <div>
      <div>
        <h2>재고 수정</h2>
        {/* 수정 폼 내용, item 데이터를 사용하여 초기 값 세팅 */}
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default ModifyStock;
