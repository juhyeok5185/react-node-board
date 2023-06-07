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

  const clickDeleteComment = async (commentno) => {
    try {
      const response = await axios.post(`/api/commentDelete?commentno=${commentno}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const clickDeleteBoard = async (boardno) => {
    console.log(boardno);
    try {
      const response = await axios.post(`/api/boardDelete?boardno=${boardno}`);
      window.location.href = "/list";
    } catch (error) {
      console.error(error);
    }
  };

  const clickUpdateComment = async (commentValue, commentno) => {
    try {
      const response = await axios.post("/api/updateComment", {
        comment: commentValue,
        commentno: commentno,
      });
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="article-area">
      {board.length > 0 ? (
        <>
          <div>{board[0].title}</div>
          <hr></hr>
          <div className="content">{board[0].content}</div>
          <div>
            <button
              onClick={() => {
                clickDeleteBoard(board[0].boardno);
              }}
            >
              삭제
            </button>
          </div>
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
            <input
              type="text"
              value={c.comment}
              onChange={(e) => {
                const updatedComments = readComment.map((comment) => {
                  if (comment.commentno === c.commentno) {
                    return { ...comment, comment: e.target.value };
                  }
                  return comment;
                });
                setReadComment(updatedComments);
              }}
            />{" "}
            <button onClick={() => clickUpdateComment(c.comment, c.commentno)}>수정</button>
            <button onClick={() => clickDeleteComment(c.commentno)}>삭제</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReadForm;
