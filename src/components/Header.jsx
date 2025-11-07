import React from "react";
import "../styles/components/Header.css";
import { useNavigate } from "react-router-dom";
import { clearLoggedUser, getLoggedUser } from "../services/storageService";

export default function Header({ setAuthenticated }) {
  const navigate = useNavigate();
  const logged = getLoggedUser();
  const nome = logged?.nome?.split(" ")[0] || "Usuário";

  const handleLogout = () => {
    clearLoggedUser();
    setAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="portal-title">Portal de Oportunidades</h2>
      </div>

      <div className="header-right">
        <span className="user">Olá, <strong>{nome}</strong></span>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
