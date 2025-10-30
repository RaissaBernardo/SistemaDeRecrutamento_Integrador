import React from "react";
import "../styles/Header.css";

export default function Header({ setAuthenticated }) {
  const handleLogout = () => {
    setAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h2>Portal Oportunidades</h2>
      </div>
      <div className="header-right">
        <div className="user">Olá, Usuário</div>
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>
    </header>
  );
}
