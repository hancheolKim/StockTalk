import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // 스타일은 별도 CSS 파일로 분리

const App = () => {
  const [users, setUsers] = useState([]); // 방명록 사용자 목록 상태
  const [name, setName] = useState(""); // 사용자 이름 상태
  const [email, setEmail] = useState(""); // 사용자 이메일 상태
  const [message, setMessage] = useState(""); // 사용자 추가 성공/실패 메시지 상태
  const [error, setError] = useState(""); // 에러 메시지 상태

  // 방명록 데이터 조회
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://w5d72d166d2ed4d422a9bb5407dfb7fd8.apppaas.app/home"
        ); // 방명록 데이터 가져오기
        setUsers(response.data); // 방명록 사용자 목록 업데이트
      } catch (error) {
        console.error("방명록 데이터를 불러오는 데 문제가 발생했습니다.", error);
        setError("방명록 데이터를 불러오는 데 문제가 발생했습니다.");
      }
    };

    fetchUsers();
  }, []);

  // 방명록에 사용자 추가
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 사용자 추가 요청
      const response = await axios.post(
        "https://w5d72d166d2ed4d422a9bb5407dfb7fd8.apppaas.app/addUser",
        {
          name: name,
          email: email
        }
      );

      setMessage(response.data); // 성공 메시지 또는 실패 메시지 출력
      setName(""); // 입력란 초기화
      setEmail(""); // 입력란 초기화
      setUsers([...users, { name, email }]); // 새로운 사용자 방명록에 추가
    } catch (error) {
      setMessage("데이터를 추가하는 데 문제가 발생했습니다.");
      console.error("방명록에 사용자 추가 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <header className="header">
        <h1>Welcome to Our Guestbook</h1>
      </header>

      <div className="container">
        {/* 방명록 조회 */}
        <h2>방명록</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="guestbook">
          {users.length > 0 ? (
            <ul>
              {users.map((user, index) => (
                <li key={index}>
                  <p>이름: {user.name}</p>
                  <p>이메일: {user.email}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>방명록에 아무것도 없습니다.</p>
          )}
        </div>

        {/* 방명록 추가 폼 */}
        <div className="actions">
          <h3>방명록에 추가</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>이름: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>이메일: </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">방명록에 추가</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      </div>

      <footer className="footer">
        &copy; 2024 Our Website. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
