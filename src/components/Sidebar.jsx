import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigRightDash,
  Home,
  Briefcase,
  FileText,
  Users,
  Calendar,
  BarChart,
  Gift,
  ClipboardList,
  Building2,
  LogOut,
  Menu,
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="menu-toggle" onClick={toggleSidebar}>
        <ArrowBigRightDash size={24} />
      </div>

      <nav>
        <Link to="/dashboard" className="menu-item">
          <Home size={20} />
          {isExpanded && <span>Dashboard</span>}
        </Link>
        <Link to="/vagas" className="menu-item">
          <Briefcase size={20} />
          {isExpanded && <span>Vagas</span>}
        </Link>
        <Link to="/candidaturas" className="menu-item">
          <FileText size={20} />
          {isExpanded && <span>Candidaturas</span>}
        </Link>
        <Link to="/entrevistas" className="menu-item">
          <Users size={20} />
          {isExpanded && <span>Entrevistas</span>}
        </Link>
      </nav>

      <button className="logout-btn" onClick={onLogout}>
        <LogOut size={20} />
        {isExpanded && <span>Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
