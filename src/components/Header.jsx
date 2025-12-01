import React from "react";
import "../styles/components/Header.css";
import { useNavigate } from "react-router-dom";
import { clearLoggedUser, getLoggedUser } from "../services/storageService";

export default function Header({ setAuthenticated }) {
  const navigate = useNavigate();
  const logged = getLoggedUser();
  const nome = logged?.nome?.split(" ")[0] || "Usuário";

  // ✅ Só RH e verificado mostra o selo
  const isVerifiedCompany = logged?.tipoUsuario === "rh" && logged?.verificado;

  const handleLogout = () => {
    clearLoggedUser();
    setAuthenticated(false);
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="portal-title">CarreiraLink</h2>
      </div>

      <div className="header-right">
        <span className="user">
          Olá, <strong>{nome}</strong>
          {isVerifiedCompany && (
            <span className="verified-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
                className="verified-icon"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              Empresa verificada
            </span>
          )}
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Sair
        </button>
      </div>
    </header>
  );
}
