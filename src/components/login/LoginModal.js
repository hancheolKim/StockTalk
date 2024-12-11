import React, { useState } from "react";
import "./LoginModal.css"; // 스타일 파일

const LoginModal = ({ onClose }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      // 로그인 데이터를 포함하여 POST 요청을 보냄
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터 전송
        },
        body: JSON.stringify({ id, password }), // id와 password를 JSON 형식으로 전달
      });

      const data = await response.json(); // 응답 데이터를 JSON으로 파싱


      // 로그인 성공 시
      if (data.success) {
        // user 정보 localStorage에 저장
        localStorage.setItem("userNum", data.user_num);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("userStatus", data.user_status);

        alert("로그인 성공!");
        onClose(); // 모달 닫기
        window.location.reload();
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
  