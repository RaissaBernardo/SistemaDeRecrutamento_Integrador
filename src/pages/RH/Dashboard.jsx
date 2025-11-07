import React, { useEffect, useState } from "react";
import {
  getCandidaturas,
  getEntrevistas,
  getVagas,
} from "../../services/storageService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../styles/rh/Dashboard.css";

export default function Dashboard() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔹 Mock temporário até o backend enviar dados reais
  const dataMock = [
    { mes: "Jan", candidaturas: 0 },
    { mes: "Fev", candidaturas: 0 },
    { mes: "Mar", candidaturas: 0 },
    { mes: "Abr", candidaturas: 0 },
    { mes: "Mai", candidaturas: 0 },
    { mes: "Jun", candidaturas: 0 },
  ];

  useEffect(() => {
    // 🔹 Substituir futuramente por fetch() do Spring Boot
    setCandidaturas(getCandidaturas() || []);
    setVagas(getVagas() || []);
    setEntrevistas(getEntrevistas() || []);
    setLoading(false);
  }, []);

  return (
    <div className="app-container">
      <main className="main-content dash-page">
        {/* ==================== CABEÇALHO ==================== */}
        <header className="dash-top">
          <h1>Painel do RH</h1>
          <p className="muted">Visão geral dos seus processos seletivos</p>
        </header>

        {/* ==================== CARDS SUPERIORES ==================== */}
        <section className="cards-superiores">
          <div className="card card1">
            <span className="card-label">Vagas ativas</span>
            <span className="card-number">{vagas.length}</span>
          </div>

          <div className="card card2">
            <span className="card-label">Candidaturas</span>
            <span className="card-number">{candidaturas.length}</span>
          </div>

          <div className="card card3">
            <span className="card-label">Entrevistas</span>
            <span className="card-number">{entrevistas.length}</span>
          </div>
        </section>

        {/* ==================== GRID: GRÁFICO + TABELA ==================== */}
        <section className="dash-linha-dupla">
          {/* ---------- Gráfico ---------- */}
          <div className="chart-section">
            <h2>Candidaturas por mês</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={dataMock}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="candidaturas"
                  fill="#0b5755"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ---------- Tabela ---------- */}
          <div className="tabela-candidaturas">
            <h2>Últimas candidaturas</h2>

            {loading ? (
              <p className="loading">Carregando...</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Vaga</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {candidaturas.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="empty">
                        Nenhuma candidatura registrada ainda.
                      </td>
                    </tr>
                  ) : (
                    candidaturas
                      .slice(-5)
                      .reverse()
                      .map((c, i) => (
                        <tr key={i}>
                          <td>{c.nome}</td>
                          <td>{c.vaga}</td>
                          <td>
                            {new Date(c.data).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <button className="btn-ver">Detalhes</button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
