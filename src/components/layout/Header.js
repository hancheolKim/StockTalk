import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleNavbar, isNavVisible, isLoggedIn, userStatus, handleLogout, setShowLoginModal }) => {
  return (
    <header className="header">
      <h1 className="header-title">
        <Link to="/" className="Header-button">My Application</Link>
      </h1>
      <button className="navbar-toggle header-button" onClick={toggleNavbar}>
        {isNavVisible ? "닫기" : "메뉴"}
      </button>
      
      {/* 로그인 상태에 따라 버튼 표시 */}
      <div className="login-section">
        {isLoggedIn ? (
          <div className="loginState">
            <p>안녕하세요, {localStorage.getItem("userId")}님! ({userStatus})</p>
            <button className="header-button" onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <button className="header-button" onClick={() => setShowLoginModal(true)}>로그인</button>
        )}
      </div>
    </header>
  );
};

export default Header;
