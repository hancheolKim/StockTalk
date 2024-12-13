import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginModal from "./components/login/LoginModal";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Item from "./components/item/Item";
import Sales from "./components/sales/Sales";
import EMP from "./components/emp/EMP";
import Navbar from "./components/layout/Navbar";
import "./App.css";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth >= 768);
  const [userStatus, setUserStatus] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);
  
  useEffect(() => {
    const user_status = localStorage.getItem("userStatus");
    if (user_status === "a") {
      setUserStatus("어드민");
    } else if (user_status === "m") {
      setUserStatus("매니저");
    } else {
      setUserStatus("사용자");
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  const toggleNavbar = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <div className="app">
      {/* Header에 로그인 상태와 상태 변경 함수 전달 */}
      <Header
        toggleNavbar={toggleNavbar}
        isNavVisible={isNavVisible}
        isLoggedIn={isLoggedIn}
        userStatus={userStatus}
        handleLogout={handleLogout}
        setShowLoginModal={setShowLoginModal}
      />
      <div className="app-body">
        <Navbar isVisible={isNavVisible} setIsVisible={setIsNavVisible} />
        <div className="main-container">
          {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<div>메인 페이지</div>} />
              <Route path="/emp" element={<EMP />} />
              <Route path="/item" element={<Item />} />
              <Route path="/sales" element={<Sales />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
