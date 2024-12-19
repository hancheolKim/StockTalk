import React from "react";
import "./Pagination.css"; // 필요한 스타일 추가

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxButtons = 5; // 한 번에 표시할 버튼 수
  const half = Math.floor(maxButtons / 2);
  let startPage = Math.max(currentPage - half, 1);
  let endPage = Math.min(startPage + maxButtons - 1, totalPages);

  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(endPage - maxButtons + 1, 1);
  }

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={currentPage === i ? "selected" : ""}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        이전
      </button>
      {pageButtons}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
};

export default Pagination;
