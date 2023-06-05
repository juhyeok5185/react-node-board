import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 중단

    const data = {
      username: username,
      password: password,
    };
    axios
      .post("/api/login", data)
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        window.location.reload();
        navigate("/list");
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  // 이미 로그인되어 있는지 확인하는 함수
  const checkLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/list");
    }
  };

  // 컴포넌트가 마운트될 때 실행되는 useEffect를 통해 이미 로그인된 상태인지 확인
  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <div className="article-area">
      <form onSubmit={handleSubmit}>
        <input className="login-input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="아이디를 입력하세요"></input>
        <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요"></input>
        <button className="login-button" type="submit">
          로그인
        </button>
      </form>
      <button className="join-button" onClick={() => navigate("/join")}>
        회원가입
      </button>
    </div>
  );
};

export default LoginForm;
