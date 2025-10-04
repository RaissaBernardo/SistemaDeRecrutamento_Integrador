import React from "react";
import "../styles/Dashboard.css";
import { FaBell, FaBars, FaSignOutAlt, FaUser, FaClipboardList } from "react-icons/fa";
import { MdWork } from "react-icons/md";

export default function Dashboard() {
  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <FaBars className="icon" />
        </div>
        <nav className="menu">
          <a href="#" className="active">
            <FaClipboardList className="icon" /> Dashboard
          </a>
          <a href="#">
            <MdWork className="icon" /> Vagas
          </a>
          <a href="#">
            <FaUser className="icon" /> Minhas candidaturas
          </a>
          <a href="#">
            <FaClipboardList className="icon" /> Entrevistas
          </a>
        </nav>
        <div className="logout">
          <FaSignOutAlt className="icon" /> Sair
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <h2>Dashboard</h2>
          <div className="header-right">
            <FaBell className="icon" />
            <span className="user">Olá, Leonardo</span>
            <img
              src="https://via.placeholder.com/40"
              alt="user"
              className="user-img"
            />
          </div>
        </header>

        <div className="notification">
          <p>Você tem <strong>1 entrevista amanhã às 14:00</strong></p>
        </div>

        <section className="cards">
          <div className="card">
            <h3>Minhas candidaturas</h3>
            <span>4</span>
          </div>
          <div className="card">
            <h3>Entrevistas agendadas</h3>
            <span>2</span>
          </div>
          <div className="card">
            <h3>Vagas recomendadas</h3>
            <span>12</span>
            <button className="btn">Ver vagas</button>
          </div>
        </section>

        <section className="status-section">
          <div className="status-card">
            <h3>Status das minhas candidaturas</h3>
            <div className="chart-placeholder">
              <span>50%</span>
            </div>
            <ul className="status-list">
              <li>Recebida</li>
              <li className="blue">Em análise</li>
              <li className="yellow">Entrevista</li>
              <li className="red">Recusado</li>
              <li className="green">Contratado</li>
            </ul>
          </div>

          <div className="status-card">
            <h3>Últimas candidaturas</h3>
            <ul className="applications">
              <li>
                <strong>Psicólogo Organizacional Sênior</strong> - Ambev
                <span className="tag blue">Em análise</span>
                <small>10/09</small>
              </li>
              <li>
                <strong>Psicólogo Forense</strong> - Escritórios Nantesi
                <span className="tag blue">Em análise</span>
                <small>05/09</small>
              </li>
              <li>
                <strong>Psicólogo Clínico Chefe</strong> - Hospital Sírio-Libanês
                <span className="tag blue">Em análise</span>
                <small>05/09</small>
              </li>
              <li>
                <strong>Consultor de seleção e recrutamento</strong> - CBF academy
                <span className="tag yellow">Entrevista</span>
                <small>30/08</small>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
