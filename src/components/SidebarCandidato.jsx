import React, { useState } from "react";
import "../styles/components/SidebarCandidato.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarCandidato({ onLogout, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Início", path: "/home-candidato", icon: "🏠" },
    { label: "Vagas", path: "/vagas-disponiveis", icon: "💼" },
    { label: "Minhas Candidaturas", path: "/minhas-candidaturas", icon: "📄" },
    { label: "Entrevistas", path: "/entrevistas-candidato", icon: "📅" },
    { label: "Perfil", path: "/perfil-candidato", icon: "👤" },
  ];

  const handleMouseEnter = () => {
    setIsOpen(true);
    if (onToggle) onToggle(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    if (onToggle) onToggle(false);
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Quadradinho "Candidato" no topo */}
      <div className="sidebar-user-tag">Candidato</div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
            data-tooltip={!isOpen ? item.label : ""}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {isOpen && <span className="sidebar-item-label">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-footer" onClick={onLogout} title="Sair">
        <div className="logout-icon" aria-label="Sair">
          ×
        </div>
        {isOpen && <span className="logout-label">Sair</span>}
      </div>
    </aside>
  );
}
