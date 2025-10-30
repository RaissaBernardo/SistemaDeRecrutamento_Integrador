import React from "react";
import "../styles/Pages.css";

export default function Dashboard() {
  return (
    <div className="page">
      <h2>Dashboard</h2>
      <div className="cards">
        <div className="card">Vagas Abertas<br/><span className="big">12</span></div>
        <div className="card">Candidatos<br/><span className="big">10</span></div>
        <div className="card">Entrevistas<br/><span className="big">4</span></div>
        <div className="card">Aprovados<br/><span className="big">2</span></div>
      </div>
    </div>
  );
}
