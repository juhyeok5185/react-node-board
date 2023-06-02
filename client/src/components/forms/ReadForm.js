import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ReadForm = () => {
  const navigate = useNavigate();
  const [board, setBaord] = useState([]);
  const [readComment, setReadComment] = useState([]);
  const [comment, setComment] = useState([]);
  const { boardno } = useParams();

  useEffect(() => {
    loadBoard(boardno);
  }, [boardno]);

  useEffect(() => {
    loadComment(boardno);
  }, [boardno]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      comment: comment,
      token: localStorage.getItem("token"),
      boardno: boardno,
    };
    axios
      .post("/api/commentWrite", formData)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        alert(error.response.data.error);
      });
  };

  const loadBoard = async (boardno) => {
    try {
      const response = await axios.get("/api/read", {
        params: {
          boardno: boardno,
        },
      });
      setBaord(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadComment = async (boardno) => {
    try {
      const response = await axios.get("/api/commentRead", {
        params: {
          boardno: boardno,
        },
      });
      setReadComment(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="article-area">
      {board.length > 0 ? (
        <>
          <input type="hidden" value={board[0].boardno}></input>
          <div>{board[0].writer}</div>
          <hr></hr>
          <div>{board[0].title}</div>
          <hr></hr>
          <div className="content">{board[0].content}</div>
          <hr></hr>
          <form onSubmit={handleSubmit}>
            <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="댓글을 작성해주세요"></input>
            <button type="submit">댓글작성</button>
          </form>
        </>
      ) : (
        <div>데이터가 없습니다.</div>
      )}
      <hr></hr>
      {readComment.map((c) => (
        <div key={c.commentno}>
          <div>
            {c.writer}| {c.comment}
          </div>
          <div>
            <input type="hidden" value={c.commentno}></input>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadForm;
