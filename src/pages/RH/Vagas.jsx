import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/rh/Vagas.css";


// 🔄 mockApi novo (namespace correto)
import { api } from "../../services/mockApi";

export default function Vagas() {
  const navigate = useNavigate();
  const location = useLocation();

  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================================
  // 🔄 Carregar vagas
  // ================================
  const carregarVagas = () => {
    try {
      const lista = api.vagas.getAll() || [];
      setVagas(lista);
    } catch (err) {
      console.error("Erro ao carregar vagas:", err);
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  // Carrega sempre que volta para esta rota
  useEffect(() => {
    carregarVagas();
  }, [location]);

  const vagasAbertas = vagas.filter(v => v.status === "Aberta").length;
  const vagasEncerradas = vagas.filter(v => v.status === "Encerrada").length;

  const handleEditar = (id) => {
    if (!id) return;
    navigate(`/vaga-form/${id}`);
  };

  return (
    <div className="main-content page-vagas">
      <div className="vagas-container">

        <h1>Vagas</h1>

        {/* ================================
            Cabeçalho — igual ao Figma
        ================================ */}
        <div className="vagas-top">
          <div className="counts">
            <span>Vagas abertas: {vagasAbertas}</span>
            <span className="divider">|</span>
            <span>Vagas encerradas: {vagasEncerradas}</span>
          </div>

          <button
            className="btn primary new-vaga-btn"
            onClick={() => navigate("/vaga-form")}
          >
            Cadastrar nova vaga +
          </button>
        </div>

        {/* ================================
            Tabela
        ================================ */}
        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Carregando...</p>
          ) : (
            <table className="vagas-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Empresa</th>
                  <th>Localização</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {vagas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty">
                      Nenhuma vaga encontrada.
                    </td>
                  </tr>
                ) : (
                  vagas.map((vaga) => (
                    <tr key={vaga.id}>
                      <td>{vaga.titulo}</td>
                      <td>{vaga.empresa}</td>
                      <td>{vaga.localizacao || "-"}</td>
                      <td>
                        {vaga.dataPublicacao
                          ? new Date(vaga.dataPublicacao).toLocaleDateString("pt-BR")
                          : new Date(vaga.id).toLocaleDateString("pt-BR")}
                      </td>
                      <td>
                        <button
                          className="btn ghost sm"
                          onClick={() => handleEditar(vaga.id)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Paginação fake como no Figma */}
        <div className="pagination">
          <button disabled>{"<"}</button>
          <button className="active">1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
          <span className="next-btn">Próximo ▸</span>
        </div>
      </div>
    </div>
  );
}
