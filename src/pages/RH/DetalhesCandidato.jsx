import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/mockApi";
import useModal from "../../hooks/useModal";

import ModalMarcarEntrevista from "../../components/modals/rh/ModalMarcarEntrevista";
import ModalRecusarCandidato from "../../components/modals/rh/ModalRecusarCandidato";
import ModalSucessoAprovado from "../../components/modals/rh/ModalSucessoAprovado";

import "../../styles/rh/DetalhesCandidato.css";

export default function DetalhesCandidato() {
  const { id } = useParams(); // ID da candidatura
  const navigate = useNavigate();

  const [candidatura, setCandidatura] = useState(null);
  const [perfil, setPerfil] = useState(null);

  const modalMarcar = useModal();
  const modalRecusar = useModal();
  const modalAprovado = useModal();

  useEffect(() => {
    const todas = api.candidaturas.getAll();
    const cand = todas.find((c) => c.id === Number(id));
    setCandidatura(cand);

    if (cand) {
      const p = api.perfis.get(cand.candidatoEmail);
      setPerfil(p);
    }
  }, [id]);

  function aprovar() {
    api.candidaturas.updateStatus(candidatura.id, "Aprovado");
    modalAprovado.open(candidatura);
  }

  if (!candidatura)
    return <p style={{ padding: 20 }}>Candidatura não encontrada.</p>;

  return (
    <div className="page-detalhes-candidato">
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        ◂ Voltar
      </button>

      <header className="topo">
        <h1>Detalhes do Candidato</h1>
        <p className="muted">Informações completas do processo</p>
      </header>

      <div className="detalhes-box">
        <section className="secao bloco-esq">
          <h2>{perfil?.nome || "Candidato"}</h2>
          <p><strong>Email:</strong> {candidatura.candidatoEmail}</p>
          {perfil?.telefone && (
            <p><strong>Telefone:</strong> {perfil.telefone}</p>
          )}
          {perfil?.linkedin && (
            <p><strong>LinkedIn:</strong> {perfil.linkedin}</p>
          )}

          {perfil?.sobre && (
            <div className="sobre">
              <h3>Sobre</h3>
              <p>{perfil.sobre}</p>
            </div>
          )}

          {perfil?.habilidades?.length > 0 && (
            <div className="habilidades">
              <h3>Habilidades</h3>
              <ul>
                {perfil.habilidades.map((h, i) => (
                  <li key={i}>{h.nome}</li>
                ))}
              </ul>
            </div>
          )}

          {perfil?.cursos?.length > 0 && (
            <div className="cursos">
              <h3>Cursos</h3>
              <ul>
                {perfil.cursos.map((c, i) => (
                  <li key={i}>{c.nome}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="secao bloco-dir">
          <h2>Informações da Vaga</h2>
          <p><strong>Vaga:</strong> {candidatura.vagaTitulo}</p>
          <p><strong>Empresa:</strong> {candidatura.empresa}</p>
          <p><strong>Status:</strong> {candidatura.status}</p>
          <p><strong>Data da candidatura:</strong> {candidatura.data}</p>

          <div className="acoes-rh">
            <button className="btn primary" onClick={() => modalMarcar.open(candidatura)}>
              Marcar entrevista
            </button>

            <button className="btn success" onClick={aprovar}>
              Aprovar candidato
            </button>

            <button className="btn danger" onClick={() => modalRecusar.open(candidatura)}>
              Recusar candidato
            </button>
          </div>
        </section>
      </div>

      {/* ==== MODAIS ==== */}
      <ModalMarcarEntrevista
        isOpen={modalMarcar.isOpen}
        onClose={modalMarcar.close}
        data={modalMarcar.data}
      />

      <ModalRecusarCandidato
        isOpen={modalRecusar.isOpen}
        onClose={modalRecusar.close}
        data={modalRecusar.data}
      />

      <ModalSucessoAprovado
        isOpen={modalAprovado.isOpen}
        onClose={modalAprovado.close}
        data={modalAprovado.data}
      />
    </div>
  );
}
