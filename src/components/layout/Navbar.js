import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isVisible, setIsVisible }) => {
  const isMobile = window.innerWidth <= 768; // 모바일 화면 여부 체크

  const isClicked = () => {
    if (isMobile) {
      setIsVisible(false); // 모바일에서만 Navbar 숨기기
    }
  };

  return (
    <div className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <Link to="/" onClick={isClicked}>
        <h2>GIANT ERP</h2>
      </Link>
      <div className="navbar-buttons">
        <Link to="/emp" className="navbar-item" onClick={isClicked}>
          인사관리
        </Link>
        <Link to="/item" className="navbar-item" onClick={isClicked}>
          재고관리
        </Link>
        <Link to="/sales" className="navbar-item" onClick={isClicked}>
          매출관리
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
