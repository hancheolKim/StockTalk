import React, { useState } from "react";
import "./LoginModal.css"; // 스타일 파일

const LoginModal = ({ onClose }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    if (!id || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 로그인 데이터를 포함하여 POST 요청을 보냄
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/user/login", {
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

        onClose(); // 모달 닫기
        window.location.reload();
      } else {
        // 실패 시 에러 코드에 따른 메시지 출력
        if (data.error === "INVALID_ID") {
          setIdError("존재하지 않는 아이디입니다.");
          setPasswordError("");
        } else if (data.error === "INVALID_PASSWORD") {
          setPasswordError("비밀번호가 일치하지 않습니다.");
          setIdError("");
        } else {
          setIdError("로그인 실패! 알 수 없는 오류가 발생했습니다.");
          setPasswordError("");
        }
      }
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다. 네트워크를 확인해주세요.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>로그인</h2>
        <div className="input-container">
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdError("");
            }}
          />
          {idError && <p className="error-text">{idError}</p>}
        </div>
        <div className="input-container">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
            }}
          />
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>
        <button onClick={handleLogin} className="login-button">로그인</button>
        <button onClick={onClose} className="cancle-button">닫기</button>
      </div>
    </div>
  );
};

export default LoginModal;
