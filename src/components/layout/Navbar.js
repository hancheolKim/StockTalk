import React from "react";
import { Link, useLocation } from "react-router-dom"; // useLocation 추가
import "./Navbar.css";

const Navbar = ({ isVisible, setIsVisible }) => {
  const location = useLocation(); // 현재 경로 추적

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
        <Link
          to="/emp"
          className={`navbar-item ${location.pathname === "/emp" ? "active" : ""}`} // 현재 경로에 따라 active 클래스 추가
          onClick={isClicked}
        >
          인사관리
        </Link>
        <Link
          to="/item"
          className={`navbar-item ${location.pathname === "/item" ? "active" : ""}`} // 현재 경로에 따라 active 클래스 추가
          onClick={isClicked}
        >
          제품관리
        </Link>
        <Link
          to="/sales"
          className={`navbar-item ${location.pathname === "/sales" ? "active" : ""}`} // 현재 경로에 따라 active 클래스 추가
          onClick={isClicked}
        >
          매출관리
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
