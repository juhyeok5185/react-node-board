import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WriteForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState([]);
  const [content, setContent] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault(); // 기본 동작 중단

    const data = {
      title: title,
      content: content,
      token: localStorage.getItem("token"),
    };
    axios
      .post("/api/write", data)
      .then((response) => {
        navigate("/list");
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea className="login-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 작성해주세요" />
        <textarea className="login-input content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 작성해주세요" />
        <button className="write-btn write" type="submit">
          작성
        </button>
      </form>
    </div>
  );
};

export default WriteForm;
