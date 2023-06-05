import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../App.css";
import logo from "../../image/logo.png";

const HeaderForm = () => {
  console.log(localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleLogoClick = () => {
    const isLoggedIn = localStorage.getItem("token");
    const route = isLoggedIn ? "/list" : "/";
    window.location.href = route;
  };

  return (
    <div className="header-area">
      <img className="header-logo" src={logo} alt="로고" onClick={handleLogoClick} />
      {localStorage.getItem("token") && (
        <button className="logout" onClick={handleLogout}>
          로그아웃
        </button>
      )}
    </div>
  );
};

export default HeaderForm;
