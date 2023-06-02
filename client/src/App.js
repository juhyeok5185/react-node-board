import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JoinForm from "./components/forms/JoinForm";
import LoginForm from "./components/forms/LoginForm";
import ListForm from "./components/forms/ListForm";
import WriteForm from "./components/forms/WriteForm";
import ReadForm from "./components/forms/ReadForm";
import HeaderForm from "./components/forms/HeaderForm";
import FooterForm from "./components/forms/FooterForm";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="wrapper">
        <header className="header">
          <HeaderForm></HeaderForm>
        </header>
        <article className="article">
          <Router>
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/join" element={<JoinForm />} />
              <Route path="/list" element={<ListForm />} />
              <Route path="/write" element={<WriteForm />} />
              <Route path="/read/:boardno" element={<ReadForm />} />
            </Routes>
          </Router>
        </article>
      </div>
      <footer className="footer">
        <FooterForm></FooterForm>
      </footer>
    </div>
  );
}

export default App;
