import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // 스타일은 별도 CSS 파일로 분리

const App = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);  // 에러 상태 추가
  const [userId, setUserId] = useState(''); // 사용자 id 상태 추가
  const [inputError, setInputError] = useState(''); // 입력 오류 상태 추가

  // 앱이 로드될 때 로컬 스토리지에서 사용자 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // 로컬 스토리지에서 가져온 사용자 정보를 상태에 저장
    }
  }, []);

  // 사용자 데이터를 가져오기 위한 useEffect
  useEffect(() => {
    if (userId !== '') {
      const fetchUser = async () => {
        try {
          // id가 한자리 숫자인지 확인
          if (userId < 0 || userId > 9) {
            setInputError('id는 한자리 숫자여야 합니다.');
            return;
          }

          const response = await axios.get(`https://w5d72d166d2ed4d422a9bb5407dfb7fd8.apppaas.app/home?id=${userId}`); // id를 쿼리 파라미터로 전달
          console.log('API 응답 데이터:', response.data);  // 응답 데이터 로그 출력
          setUser(response.data); // 사용자 정보 설정

          // 사용자 정보를 로컬 스토리지에 저장
          localStorage.setItem("user", JSON.stringify(response.data));

        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setError("데이터를 불러오는 데 문제가 발생했습니다. 나중에 다시 시도해주세요.");  // 에러 메시지 설정
        }
      };

      fetchUser();
    }
  }, [userId]);

  return (
    <div>
      <header className="header">
        <h1>Welcome to Our Website</h1>
      </header>

      <div className="container">
        <h2>
          안녕, <span>{user ? user.name : "방문자"}</span>님!
          이건 React로 배포한 프론트엔드 서버!
        </h2>

        {/* 에러 메시지 표시 */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {/* 입력 오류 메시지 표시 */}
        {inputError && (
          <div className="error-message">
            <p>{inputError}</p>
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

        {/* 사용자 ID 입력란 */}
        {!user && (
          <div className="actions">
            <input
              type="number"
              max="9"
              min="0"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="아이디 입력 (한자리 숫자)"
            />
          </div>
        )}

        {/* 로그인/회원가입 버튼 */}
        {!user && !inputError && (
          <div className="actions">
            <a href="/login">로그인</a>
            <a href="/signup">회원가입</a>
          </div>
        )}

        {/* 로그아웃 버튼 */}
        {user && (
          <div className="actions">
            <a href="/logout" onClick={() => {
              // 로그아웃 시 로컬 스토리지에서 사용자 정보 삭제
              localStorage.removeItem("user");
              setUser(null); // 사용자 정보 상태 초기화
            }}>
              로그아웃
            </a>
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
