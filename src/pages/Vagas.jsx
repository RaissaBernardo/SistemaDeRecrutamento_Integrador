import React, { useState } from "react";
import "../styles/Pages.css";
import { FaEdit, FaPlus } from "react-icons/fa";
import "../styles/Vagas.css";
import { useNavigate } from "react-router-dom";

export default function Vagas() {
  const navigate = useNavigate();

  // Deixando o estado de vagas vazio para ser preenchido pelo back-end depois
  const [vagas, setVagas] = useState([]); 


  const vagasAbertas = 0; 
  const vagasEncerradas = 0; 

  return (
    <div className="pagina-vagas">
      {}
      <div className="vagas-topo">
        <h2>Vagas</h2>
        <div className="status-contagem">
          <p>
            Vagas abertas: <strong>{vagasAbertas}</strong>
          </p>
          <p>
            Vagas encerradas: <strong>{vagasEncerradas}</strong>
          </p>
        </div>
        <button
          className="btn-nova-vaga"
          onClick={() => navigate("/cadastrar-vaga")}
        >
          <FaPlus /> Nova Vaga
        </button>
      </div>

      {/* Tabela de vagas */}
      <table className="tabela-vagas">
        <thead>
          <tr>
            <th>Título</th>
            <th>Localização</th>
            <th>Data de Publicação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Nenhuma vaga para exibir */}
          {vagas.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhuma vaga cadastrada</td>
            </tr>
          ) : (
            vagas.map((vaga) => (
              <tr key={vaga.id}>
                <td>{vaga.titulo}</td>
                <td>{vaga.localizacao}</td>
                <td>{vaga.data}</td>
                <td>
                  <button className="btn-acao">
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="paginacao">
        <button>⬅️</button>
        <button className="pagina-ativa">1</button>
        <button>2</button>
        <button>3</button>
        <button>➡️</button>
        <span>Próximo</span>
      </div>
    </div>
  );
}
