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
      className={`sidebar-candidato ${isOpen ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-candidato-header">
        <img src="/logo192.png" alt="Logo" className="sidebar-logo" />
        <h2>Candidato</h2>
      </div>

      <div className="sidebar-candidato-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-candidato-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
            data-tooltip={item.label}
          >
            <span className="sidebar-candidato-item-icon">{item.icon}</span>
            <span className="sidebar-candidato-item-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-candidato-footer" onClick={onLogout}>
        ⏻ <span>Sair</span>
        <span className="sidebar-toggle">➡</span>
      </div>
    </aside>
  );
}
