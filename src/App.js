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

  
  const toggleNavbar = () => {
    setIsNavVisible((prev) => !prev);
  };

  return (
    <div className="app">

      <Header
        toggleNavbar={toggleNavbar}
        isNavVisible={isNavVisible}
        setShowLoginModal={setShowLoginModal}
      />
      <div className="app-body">
        <Navbar isVisible={isNavVisible} setIsVisible={setIsNavVisible} />
        <div className="main-container">
          {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<ProjectInfo />} />
              <Route path="/emp" element={<EMP />} />
              <Route path="/item" element={<Item />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/Signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
