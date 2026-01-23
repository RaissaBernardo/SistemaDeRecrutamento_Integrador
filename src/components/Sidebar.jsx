import React, { useState } from "react";
import "../styles/components/SidebarRH.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Vagas", path: "/vagas", icon: "💼" },
    { label: "Candidaturas", path: "/candidaturas", icon: "👤" },
    { label: "Entrevistas", path: "/entrevistas", icon: "📅" },
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
      {/* Quadradinho "RH" no topo */}
      <div className="sidebar-user-tag">RH</div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${
              location.pathname.includes(item.path) ? "active" : ""
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
