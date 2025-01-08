import React, { useState } from "react";
import "./LoginModal.css"; // 스타일 파일

const LoginModal = ({ onClose, setIsLoggedIn }) => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async () => {
    let hasError = false;

    // 아이디 검증
    if (!id) {
      setIdError("아이디를 입력하세요.");
      hasError = true;
    }

    // 비밀번호 검증
    if (!password) {
      setPasswordError("비밀번호를 입력하세요.");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch("https://n0b85a7897a3e9c3213c819af9d418042.apppaas.app/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        onClose();
        setIsLoggedIn(true);
      } else {
        alert("아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error(error);
      alert("로그인 요청 중 오류가 발생했습니다. 네트워크를 확인해주세요.");
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value;
    setId(value);

    // 한글 및 특수문자 검증
    if (!/^[a-zA-Z0-9]*$/.test(value)) {
      setIdError("아이디는 영어, 숫자만 가능합니다.");
    } else {
      setIdError(""); // 에러 초기화
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2>로그인</h2>
        <div className="input-container">
        <input
          type="text"
          placeholder="아이디"
          value={id}
          onChange={handleIdChange}
          className="input-field"
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
            setPasswordError(""); // 에러 초기화
          }}
          className="input-field"
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
