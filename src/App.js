import React, { useState, useEffect } from "react";
import axios from "axios";
import NewPage from "./components/NewPage";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css"; // 스타일은 별도 CSS 파일로 분리

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={
            <div className="actions">
              <Link to="/NewPage">
                <button>NewPage로 이동</button>
              </Link>
            </div>
        } />
        
        {/* NewPage 컴포넌트에 대한 경로 */}
        <Route path="/NewPage" element={<NewPage/>} />
      </Routes>
    </div>
  );
};

export default App;
