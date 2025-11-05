import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/components/SidebarCandidato.css";
import { Home, Briefcase, FileCheck, User, LogOut, Calendar } from "lucide-react";

const SidebarCandidato = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`sidebar-candidato ${isOpen ? "open" : "closed"}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="sidebar-header">
        <h2 className="sidebar-title">Candidato</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/home-candidato" className={({isActive}) => `sidebar-link ${isActive ? "active":""}`}>
          <Home size={20} /><span>Início</span>
        </NavLink>

        <NavLink to="/vagas-disponiveis" className={({isActive}) => `sidebar-link ${isActive ? "active":""}`}>
          <Briefcase size={20} /><span>Vagas</span>
        </NavLink>

        <NavLink to="/minhas-candidaturas" className={({isActive}) => `sidebar-link ${isActive ? "active":""}`}>
          <FileCheck size={20} /><span>Minhas Candidaturas</span>
        </NavLink>

        <NavLink to="/entrevistas-candidato" className={({isActive}) => `sidebar-link ${isActive ? "active":""}`}>
          <Calendar size={20} /><span>Entrevistas</span>
        </NavLink>

        <NavLink to="/perfil-candidato" className={({isActive}) => `sidebar-link ${isActive ? "active":""}`}>
          <User size={20} /><span>Perfil</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={() => onLogout && onLogout()}>
          <LogOut size={18} /><span>Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarCandidato;
