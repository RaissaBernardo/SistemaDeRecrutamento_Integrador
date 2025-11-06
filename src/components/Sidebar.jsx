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
    if (onToggle) onToggle(true); // avisa o App que abriu
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
    if (onToggle) onToggle(false); // avisa o App que fechou
  };

  return (
    <aside
      className={`sidebar ${isOpen ? "open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`sidebar-item ${
              location.pathname.includes(item.path) ? "active" : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            <span className="sidebar-item-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="sidebar-footer" onClick={onLogout}>
        ⏻ <span>Sair</span> <span className="sidebar-toggle">➡</span>
      </div>
    </aside>
  );
}
