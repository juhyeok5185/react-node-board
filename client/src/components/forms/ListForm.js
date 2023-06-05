import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const ListForm = () => {
  const navigate = useNavigate();
  const [board, setBoard] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지
  const [prev, setPrev] = useState();
  const [start, setStart] = useState();
  const [last, setLast] = useState();
  const [next, setNext] = useState();
  const [totalPage, setTotalPage] = useState();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    loadPagination();
  }, [page]);

  useEffect(() => {
    loadBoard();
  }, [page]); // 페이지가 변경될 때마다 데이터를 가져옴

  const loadPagination = async () => {
    try {
      const response = await axios.get(`/api/pagination?page=${page}`);
      const { totalPage, prev, start, last, next } = response.data;
      setTotalPage(totalPage);
      setPrev(prev);
      setStart(start);
      setLast(last <= totalPage ? last : totalPage);
      setNext(next <= totalPage ? next : totalPage);
    } catch (error) {
      console.error(error);
    }
  };

  const loadBoard = async () => {
    try {
      const response = await axios.get(`/api/list?page=${page}`);
      setBoard(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber === 0) {
      return;
    }
    setPage(pageNumber);
  };

  return (
    <div className="article-area">
      <table className="board-table">
        <thead>
          <tr>
            <th>게시물번호</th>
            <th>제목</th>
            <th>작성자</th>
          </tr>
        </thead>
        <tbody>
          {board.map((d) => (
            <tr key={d.boardno}>
              <td>{d.boardno}</td>
              <td>
                <Link to={`/read/${d.boardno}`}>{d.title}</Link>
              </td>
              <td>{d.writer}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <ul className="pagination">
          <li className="prev-btn" onClick={() => handlePageClick(prev)}>
            Prev
          </li>
          {Array.from({ length: last - start + 1 }, (_, index) => {
            const pageNumber = start + index;
            return (
              <li key={pageNumber} onClick={() => handlePageClick(pageNumber)} className={page === pageNumber ? "active" : ""}>
                {pageNumber}
              </li>
            );
          })}
          <li className="prev-btn" onClick={() => handlePageClick(next)}>
            Next
          </li>
        </ul>
      </div>
      <button className="write-btn" onClick={() => navigate("/write")}>
        글 작성
      </button>
    </div>
  );
};

export default ListForm;
