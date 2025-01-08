import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LoginModal from "./components/login/LoginModal";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Item from "./components/item/Item";
import Sales from "./components/sales/Sales";
import EMP from "./components/emp/EMP";
import Navbar from "./components/layout/Navbar";
import Signup from "./components/login/Signup";
import "./App.css";
import ProjectInfo from "./components/main/ProjectInfo";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(window.innerWidth >= 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 컴포넌트 마운트 시 localStorage에서 로그인 정보 확인
    useEffect(() => {
      const storedUserData = localStorage.getItem("user");
      if (storedUserData) {
        setIsLoggedIn(true);
      }
    }, []); // 빈 배열을 넣어 컴포넌트 마운트 시 한 번만 실행

  // 화면 크기 변경 시 Navbar 표시/숨김 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleNavbar = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <div className="app">
      <Header
        toggleNavbar={toggleNavbar}
        isNavVisible={isNavVisible}
        setShowLoginModal={setShowLoginModal}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div className="app-body">
        <Navbar isVisible={isNavVisible} setIsVisible={setIsNavVisible} />
        <div className="main-container">
          {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} setIsLoggedIn={setIsLoggedIn} />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<ProjectInfo/>} />
              <Route path="/emp" element={<EMP />} />
              <Route path="/item" element={<Item/>} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/Signup" element={<Signup/>} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
