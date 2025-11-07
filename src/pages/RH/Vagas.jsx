import React, { useEffect, useState } from "react";
import "../../styles/rh/Vagas.css";
import { useNavigate, useLocation } from "react-router-dom";
import { getVagas } from "../../services/storageService";

export default function Vagas() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vagas, setVagas] = useState([]);

  // 🔹 Atualiza lista de vagas
  const carregarVagas = () => {
    const vagasSalvas = getVagas() || [];
    setVagas(vagasSalvas);
  };

  // 🔹 Ao montar e ao retornar do cadastro/edição
  useEffect(() => {
    carregarVagas();
  }, [location]);

  const vagasAbertas = vagas.length;
  const vagasEncerradas = 0;

  // 🔹 Navegar para edição com segurança
  const handleEditar = (id) => {
    if (!id) return;
    navigate(`/vaga-form/${id}`); // rota dinâmica
  };

  return (
    <div className="main-content page-vagas">
      <div className="vagas-container">
        <h1>Vagas</h1>

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
            Cadastrar nova Vaga +
          </button>
        </div>

        <div className="table-wrapper">
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
        </div>

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
