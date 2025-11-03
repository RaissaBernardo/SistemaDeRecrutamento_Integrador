import React, { useState } from 'react';
import '../styles/Pages.css';
import '../styles/Entrevistas.css';

const FormatoCell = ({ formato, local }) => {
  let text = '';

  if (formato === 'Presencial') {
    text = local || 'Presencial';
  } else if (formato === 'Meet') {
    text = 'Google Meet';
  } else if (formato === 'Teams') {
    text = 'MS Teams';
  } else {
    text = formato || local;
  }

  return (
    <div className="formato-cell">
      { }
      <span>{text}</span>
    </div>
  );
};

export default function Entrevistas() {
  const [entrevistas, setEntrevistas] = useState([]); // Começa vazio
  const [filtro, setFiltro] = useState('hoje-e-futuras');
  const [busca, setBusca] = useState('');

  return (
    <div className="pagina">
      {/* Título da página */}
      <div className="topo-pagina">
        <h2>Entrevistas</h2>
      </div>

      {/* Controles de Filtro e Busca */}
      <div className="controles-container">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="select-filtro"
        >
          <option value="hoje-e-futuras">Hoje e futuras</option>
          <option value="passadas">Passadas</option>
          <option value="todas">Todas</option>
        </select>

        <div className="busca-container">
          <input
            type="text"
            placeholder="Pesquisar..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Entrevistas */}
      <div className="tabela-container">
        <table className="tabela-entrevistas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Vaga</th>
              <th>Data</th>
              <th>Formato</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {entrevistas.length > 0 ? (
              entrevistas.map((item, index) => (
                <tr key={item.id || index}> {/* Use um 'id' único se vier da API */}
                  <td className="celula-nome">{item.nome}</td>
                  <td className="celula-vaga">{item.vaga}</td>
                  <td className="celula-data">
                    <strong>{item.data}</strong>
                    <small>{item.hora}</small>
                  </td>
                  <td className="celula-formato">
                    <FormatoCell formato={item.formato} local={item.local} />
                  </td>
                  <td className="celula-acoes">
                    <button className="btn-detalhes">Detalhes</button>
                  </td>
                </tr>
              ))
            ) : (
              // Estado de tabela vazia
              <tr>
                <td colSpan="5" className="celula-vazia">
                  Nenhuma entrevista agendada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="paginacao">
        <button className="pag-btn">&lt;</button>
        <button className="pag-btn active">1</button>
        <button className="pag-btn">2</button>
        <button className="pag-btn">3</button>
        <button className="pag-btn">&gt;</button>
      </div>
    </div>
  );
}