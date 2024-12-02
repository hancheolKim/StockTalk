import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // 스타일은 별도 CSS 파일로 분리

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);  // 에러 상태 추가

  // 사용자 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://w5d72d166d2ed4d422a9bb5407dfb7fd8.apppaas.app/home"); // 백엔드 API 호출
        console.log('API 응답 데이터:', response.data);  // 응답 데이터 로그 출력
        setUser(response.data); // 사용자 정보 설정
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("데이터를 불러오는 데 문제가 발생했습니다. 나중에 다시 시도해주세요.");  // 에러 메시지 설정
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <header className="header">
        <h1>Welcome to Our Website</h1>
      </header>

      <div className="container">
        <h2>
          안녕, <span>{user ? user.name : "방문자"}</span>님!
        </h2>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* 사용자 정보 출력 */}
        {user && (
          <div className="user-info">
            <p>아이디: {user.id}</p>
            <p>이메일: {user.email}</p>
            <p>가입일: {user.createdAt}</p>
          </div>
        )}

        {/* 로그인/회원가입 버튼 */}
        {!user && (
          <div className="actions">
            <a href="/login">로그인</a>
            <a href="/signup">회원가입</a>
          </div>
        )}

        {/* 로그아웃 버튼 */}
        {user && (
          <div className="actions">
            <a href="/logout">로그아웃</a>
          </div>
        )}
      </div>

      <footer className="footer">
        &copy; 2024 Our Website. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
