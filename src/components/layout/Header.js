import React, { useState, useEffect } from "react";
import { Link, location } from "react-router-dom";
import "./Header.css";

const Header = ({ toggleNavbar, isNavVisible, setShowLoginModal}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userStatus, setUserStatus] = useState("");

  useEffect(() => {
    // 로컬스토리지에서 유저 데이터 가져오기
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUserData(storedUser.user); // 사용자 정보 저장
      setIsLoggedIn(true);
      if (storedUser.user.status === "a") {
        setUserStatus("어드민");
      } else if (storedUser.user.status === "m") {
        setUserStatus("매니저");
      } else {
        setUserStatus("사용자");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserData(null); // 로그아웃 시 데이터 초기화
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
            <p>안녕하세요, {userData?.userName}님! ({userStatus})</p>
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
