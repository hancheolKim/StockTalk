import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginModal from "./components/LoginModal";
import "./App.css";

const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <div className="actions">
        <button onClick={() => setShowLoginModal(true)}>로그인</button>
      </div>
      <Routes>
        <Route path="/" element={<div>메인 페이지</div>} />
      </Routes>
    </div>
  );
};

export default App;
