import React, { useEffect, useState } from "react";
import { api } from "../../services/mockApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import useModal from "../../hooks/useModal";
import ModalDetalhesCandidatura from "../../components/modals/candidato/ModalDetalhesCandidatura";

import "../../styles/rh/Dashboard.css";

export default function Dashboard() {
  const [candidaturas, setCandidaturas] = useState([]);
  const [vagas, setVagas] = useState([]);
  const [entrevistas, setEntrevistas] = useState([]);
  const [loading, setLoading] = useState(true);

  const modal = useModal();
  const [candidaturaSelecionada, setCandidaturaSelecionada] = useState(null);

  // =======================================================
  // 🔢 Função REAL que gera o gráfico por mês
  // =======================================================
  function gerarDadosMensais(cands) {
    const meses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];

    const contagem = Array(12).fill(0);

    cands.forEach((c) => {
      if (!c.data) return;
      const mes = new Date(c.data).getMonth(); // 0–11
      contagem[mes]++;
    });

    return meses.map((mes, i) => ({
      mes,
      candidaturas: contagem[i],
    }));
  }

  // =======================================================
  // 🔄 Carregamento do mock
  // =======================================================
  useEffect(() => {
    setCandidaturas(api.candidaturas.getAll());
    setVagas(api.vagas.getAll());
    setEntrevistas(api.entrevistas.getAll());

    setLoading(false);
  }, []);

  // 🔹 Dados reais do gráfico
  const dataGrafico = gerarDadosMensais(candidaturas);

  // =======================================================
  // 🔹 Função para abrir modal com candidatura correta
  // =======================================================
  function abrirDetalhes(c) {
    setCandidaturaSelecionada(c);
    modal.open();
  }

  return (
    <div className="app-container">
      <main className="main-content dash-page">

        {/* HEADER */}
        <header className="dash-top">
          <h1>Painel do RH</h1>
          <p className="muted">Visão geral dos processos seletivos</p>
        </header>

        {/* CARDS SUPERIORES */}
        <section className="cards-superiores">
          <div className="card card1">
            <span className="card-label">Vagas ativas</span>
            <span className="card-number">{vagas.length}</span>
          </div>

          <div className="card card2">
            <span className="card-label">Candidaturas recebidas</span>
            <span className="card-number">{candidaturas.length}</span>
          </div>

          <div className="card card3">
            <span className="card-label">Entrevistas</span>
            <span className="card-number">{entrevistas.length}</span>
          </div>
        </section>

        {/* GRÁFICO + TABELA */}
        <section className="dash-linha-dupla">
          <div className="chart-section">
            <h2>Candidaturas por mês</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={dataGrafico}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="candidaturas" fill="#0b5755" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

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
                      .map((c) => (
                        <tr key={c.id}>
                          <td>{c.nome || "Candidato"}</td>
                          <td>{c.vagaTitulo}</td>
                          <td>
                            {new Date(c.data).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                          <td>
                            <button
                              className="btn-ver"
                              onClick={() => abrirDetalhes(c)} // ✅ envia candidatura correta
                            >
                              Detalhes
                            </button>
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

      {/* MODAL DE DETALHES */}
      {modal.isOpen && candidaturaSelecionada && (
        <ModalDetalhesCandidatura
          isOpen={modal.isOpen}
          onClose={() => {
            modal.close();
            setCandidaturaSelecionada(null);
          }}
          candidatura={candidaturaSelecionada}
        />
      )}
    </div>
  );
}
