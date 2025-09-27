import React from "react";
import "./Header.css";

const Header = ({ title }) => {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div className="user-info">
        <span>Olá, Leonardo</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="user-avatar"
        />
      </div>
    </div>
  );
};

export default Header;
