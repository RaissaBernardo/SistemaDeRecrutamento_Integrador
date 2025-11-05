import React from "react";
import "../styles/components/SidebarRH.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: "📊" },
    { label: "Vagas", path: "/vagas", icon: "💼" },
    { label: "Candidaturas", path: "/candidaturas", icon: "👤" },
    { label: "Entrevistas", path: "/entrevistas", icon: "📅" },
  ];

  return (
    <aside className="sidebar">
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
            <span>{item.label}</span>
          </div>
        ))}

      </div>

      <div className="sidebar-footer" onClick={onLogout}>
        ⏻ <span>Sair</span>
      </div>
    </aside>
  );
}
