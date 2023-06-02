const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const app = express();
const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");
const port = process.env.PORT || 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const connection = mysql.createConnection({
  host: "127.0.0.1",
  port: "3306",
  user: "root",
  password: "1q2w3e4r!Q@W",
  database: "test",
});
connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err);
  } else {
    console.log("MySQL에 연결되었습니다.");
  }
});
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행되었습니다.`);
});

app.post("/api/join", (req, res) => {
  const { name, username, password } = req.body;
  const query = `INSERT INTO member (name, username, password) VALUES (?, ?, ?)`;
  connection.query(query, [name, username, password], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "데이터를 삽입하는 중에 오류가 발생했습니다." });
    } else {
      console.log("데이터가 성공적으로 삽입되었습니다.");
      res.json({ message: "데이터를 성공적으로 받았습니다." });
    }
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM member WHERE username = ?`;
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "로그인 중에 오류가 발생했습니다." });
    } else {
      if (results.length > 0) {
        const user = results[0];
        if (password === user.password) {
          const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

          res.json({ token });
        } else {
          res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
        }
      } else {
        res.status(401).json({ error: "존재하지 않는 유저입니다." });
      }
    }
  });
});

app.get("/api/list", (req, res) => {
  const { page } = req.query;
  const itemsPerPage = 10; // 페이지당 아이템 개수
  const startIndex = (page - 1) * itemsPerPage; // 시작 인덱스 계산

  const query = `SELECT * FROM board ORDER BY boardno DESC LIMIT ${startIndex}, ${itemsPerPage}`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query: ", error);
      res.status(500).json({ error: "Error executing query" });
    } else {
      res.json(results);
    }
  });
});

app.post("/api/write", (req, res) => {
  const { title, content, token } = req.body;
  const username = jwt.verify(token, secretKey).username;
  const query = `INSERT INTO board (title, content, writer) VALUES (?, ?, ?)`;
  connection.query(query, [title, content, username], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "데이터를 삽입하는 중에 오류가 발생했습니다." });
    } else {
      console.log("데이터가 성공적으로 삽입되었습니다.");
      res.json({ message: "데이터를 성공적으로 받았습니다." });
    }
  });
});

app.get("/api/read", (req, res) => {
  const { boardno } = req.query;
  const query = "select * from board where boardno = ?";
  connection.query(query, [boardno], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "로그인 중에 오류가 발생했습니다." });
    } else {
      res.json(results); // 데이터를 JSON 형식으로 응답
    }
  });
});

app.post("/api/commentWrite", (req, res) => {
  const { comment, token, boardno } = req.body;
  const username = jwt.verify(token, secretKey).username;
  const query = `INSERT INTO comment (boardno, comment, writer) VALUES (?, ?, ?)`;
  connection.query(query, [boardno, comment, username], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "데이터를 삽입하는 중에 오류가 발생했습니다." });
    } else {
      console.log("데이터가 성공적으로 삽입되었습니다.");
      res.json({ message: "데이터를 성공적으로 받았습니다." });
    }
  });
});

app.get("/api/commentRead", (req, res) => {
  const { boardno } = req.query;
  const query = `select * from comment where boardno = ?`;
  connection.query(query, [boardno], (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "데이터를 삽입하는 중에 오류가 발생했습니다." });
    } else {
      console.log("성공");
      res.json(results); // 데이터를 JSON 형식으로 응답
    }
  });
});

app.get("/api/pagination", (req, res) => {
  const { page } = req.query;
  const query = `select count(*) from board`;
  connection.query(query, (error, results) => {
    if (error) {
      console.error("MySQL 쿼리 오류:", error);
      res.status(500).json({ error: "데이터를 삽입하는 중에 오류가 발생했습니다." });
    } else {
      const totalPage = Math.ceil(results[0]["count(*)"] / 10); // 결과 값을 totalPage에 할당
      const prev = Math.floor((page - 1) / 5) * 5;
      const start = prev + 1;
      const next = start + 5;
      const last = next - 1;
      res.json({ totalPage, prev, start, last, next });
    }
  });
});
