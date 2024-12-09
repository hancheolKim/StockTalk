import React, { useState } from "react";
import axios from "axios";
import "./LoginModal.css"; // 스타일 파일

const LoginModal = ({ onClose }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 백엔드 서버의 URL로 요청을 보냄
      const response = await axios.post("http://localhost:8080/login", { id, password });

      // 로그인 성공 시
      if (response.data.success) {
        alert("로그인 성공!");
        onClose(); // 모달 닫기
      } else {
        alert("로그인 실패! 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>로그인</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default LoginModal;
