import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 중단

    const data = {
      name: name,
      username: username,
      password: password,
    };
    axios
      .post("/api/join", data)
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="article-area join">
      <form onSubmit={handleSubmit}>
        <input className="login-input" type="text" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)}></input>
        <input className="login-input" placeholder="아이디를 입력하세요" type="text" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <input className="login-input" placeholder="비밀번호를 입력하세요" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button className="suc-join" type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
