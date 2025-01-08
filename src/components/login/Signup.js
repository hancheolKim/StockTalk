import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"

const SignupPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("u"); // 기본 상태는 사용자
  const [message, setMessage] = useState(""); // 서버 메시지를 표시할 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
  }

  return (
    <div className="signup-page">
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">회원가입</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignupPage;
