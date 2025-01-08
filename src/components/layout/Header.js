import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleNavbar, isNavVisible, setShowLoginModal, isLoggedIn, setIsLoggedIn }) => {

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  // 상태에 따라 사용자 역할 텍스트 변경
  const getUserRole = (status) => {
    switch (status) {
      case 'a':
        return '어드민';
      case 'm':
        return '매니저';
      case 'u':
        return '사용자';
      default:
        return '미정';
    }
  };

  return (
    <header className="header">
      <h1 className="header-title">
        <Link to="/" className="Header-button">HANCHEOL ERP</Link>
      </h1>

      {/* 로그인 상태에 따라 버튼 표시 */}
      <div className="login-section">
        {isLoggedIn ? (
          <div className="loginState">
            <p>안녕하세요, {user.userName}님! ({getUserRole(user.status)})</p>
            <button className="header-button" onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div className="loginState">
            <button className="header-button" onClick={() => setShowLoginModal(true)}>로그인</button>
            <Link to="/Signup" style={{ textDecoration: 'none' }}>
              <button className="header-button">
                회원가입
              </button>
            </Link>
          </div>
        )}
      </div>

      <button className="navbar-toggle header-button" onClick={toggleNavbar}>
        {isNavVisible ? "닫기" : "메뉴"}
      </button>
    </header>
  );
};

export default Header;
