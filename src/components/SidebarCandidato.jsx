import React from "react";
import "../styles/components/SidebarCandidato.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

export default function SidebarCandidato({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, toggleSidebar } = useSidebar();

  const menuItems = [
    { label: "Início", path: "/home-candidato", icon: "🏠" },
    { label: "Vagas", path: "/vagas-disponiveis", icon: "💼" },
    { label: "Minhas Candidaturas", path: "/minhas-candidaturas", icon: "📄" },
    { label: "Entrevistas", path: "/entrevistas-candidato", icon: "📅" },
    { label: "Perfil", path: "/perfil-candidato", icon: "👤" },
  ];

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      
      {/* Toggle */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {open ? "⬅" : "➡"}
      </button>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${
              location.pathname === item.path ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
            data-tooltip={!open ? item.label : ""}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {open && <span className="sidebar-item-label">{item.label}</span>}
          </div>
        ))}
      </div>

      <div className="sidebar-footer" onClick={onLogout}>
        ⏻ {open && <span>Sair</span>}
      </div>
    </aside>
  );
}
