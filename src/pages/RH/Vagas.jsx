import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/rh/Vagas.css";
import { getVagas } from "../../services/storageService";

export default function Vagas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Carrega vagas do storage (ou backend futuramente)
  const carregarVagas = () => {
    try {
      const vagasSalvas = getVagas() || [];
      setVagas(vagasSalvas);
    } catch {
      setVagas([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Atualiza ao montar e ao voltar de outras rotas
  useEffect(() => {
    carregarVagas();
  }, [location]);

  const vagasAbertas = vagas.length;
  const vagasEncerradas = 0; // placeholder — Spring Boot preencherá

  const handleEditar = (id) => {
    if (!id) return;
    navigate(`/vaga-form/${id}`);
  };

  return (
    <div className="main-content page-vagas">
      <div className="vagas-container">
        <h1>Vagas</h1>

        {/* 🔹 Topo com contadores e botão */}
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

        {/* 🔹 Tabela */}
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
                          ? vaga.dataPublicacao
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

        {/* 🔹 Paginação estática */}
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
