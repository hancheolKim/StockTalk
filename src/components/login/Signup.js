import React, { useState } from "react";
import axios from "axios";
import "./Signup.css"
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // 서버 메시지를 표시할 상태
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.");
      return;
  }
}

const checkIdAvailability = async () => {
  try {
    const response = await axios.post("/api/check-id", { id });
    setMessage(response.data.message); // 중복 여부 메시지 표시
  } catch (error) {
    setMessage("아이디 중복 검사 중 오류가 발생했습니다.");
  }
};
  

  return (
    <div className="signup-page">
    <h2>회원가입</h2>
      <div className="signup-form-container">

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label className="signup-label">아이디</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
            <button type="button" onClick={checkIdAvailability}>아이디 확인</button>
        </div>
        <div className="form-group">
          <label className="signup-label">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="signup-label">비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="signup-label">이름</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="signup-label">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button type="submit">회원가입</button>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button>
              취소
            </button>
          </Link>
        </div>
      </form>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignupPage;
