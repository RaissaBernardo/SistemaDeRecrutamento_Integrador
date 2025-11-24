import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/mockApi";
import useModal from "../../hooks/useModal";

import ModalMarcarEntrevista from "../../components/modals/rh/ModalMarcarEntrevista";
import ModalRecusarCandidato from "../../components/modals/rh/ModalRecusarCandidato";

import "../../styles/rh/DetalhesCandidato.css";

export default function DetalhesCandidato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [candidatura, setCandidatura] = useState(null);
  const [perfil, setPerfil] = useState(null);

  const modalMarcar = useModal();
  const modalRecusar = useModal();

  function recarregar() {
    const todas = api.candidaturas.getAll();
    const nova = todas.find((c) => c.id === Number(id));
    setCandidatura(nova);
  }

  useEffect(() => {
    const todas = api.candidaturas.getAll();
    const cand = todas.find((c) => c.id === Number(id));
    setCandidatura(cand);

    if (cand) {
      const p = api.perfis.get(cand.candidatoEmail);
      setPerfil(p);
    }
  }, [id]);

  // ============================
  // AÇÕES DO RH
  // ============================

  function definirAnalise() {
    api.candidaturas.updateStatus(candidatura.id, "Em análise");
    recarregar();
  }

  function abrirEntrevista() {
    modalMarcar.open(candidatura);
  }

  function reprovarDireto() {
    modalRecusar.open(candidatura);
  }

  if (!candidatura)
    return <p style={{ padding: 20 }}>Candidatura não encontrada.</p>;

  // ============================
  // REGRAS DE VISIBILIDADE DOS BOTÕES
  // ============================

  const podeDefinirAnalise = candidatura.status === "Pendente";

  const podeMarcarEntrevista =
    candidatura.status === "Pendente" ||
    candidatura.status === "Em análise";

  const podeReprovar =
    candidatura.status === "Pendente" ||
    candidatura.status === "Em análise";

  const mostrarAcoes =
    candidatura.status === "Pendente" ||
    candidatura.status === "Em análise";

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

        {/* BLOCO ESQUERDO — PERFIL */}
        <section className="secao bloco-esq">

          <h2>{perfil?.nome || "Candidato"}</h2>

          <p><strong>Email: </strong>{perfil?.email}</p>
          <p><strong>Telefone: </strong>{perfil?.celular || "Não informado"}</p>
          <p><strong>Endereço: </strong>{perfil?.endereco || "Não informado"}</p>

          {perfil?.resumo && (
            <div className="secao-item">
              <h3>Resumo Profissional</h3>
              <p>{perfil.resumo}</p>
            </div>
          )}

          {perfil?.formacao?.length > 0 && (
            <div className="secao-item">
              <h3>Formação</h3>
              {perfil.formacao.map((f, i) => (
                <div key={i} className="item-lista">
                  <strong>{f.curso}</strong>
                  <p>{f.instituicao}</p>
                  <p className="periodo">{f.inicio} — {f.fim}</p>
                  <p>{f.status}</p>
                </div>
              ))}
            </div>
          )}

          {perfil?.experiencias?.length > 0 && (
            <div className="secao-item">
              <h3>Experiências</h3>
              {perfil.experiencias.map((e, i) => (
                <div key={i} className="item-lista">
                  <strong>{e.cargo}</strong>
                  <p>{e.empresa}</p>
                  <p className="periodo">{e.inicio} — {e.fim}</p>
                  <p>{e.descricao}</p>
                </div>
              ))}
            </div>
          )}

          {perfil?.cursos?.length > 0 && (
            <div className="secao-item">
              <h3>Cursos</h3>
              {perfil.cursos.map((c, i) => (
                <div key={i} className="item-lista">
                  <strong>{c.nome}</strong>
                  <p>{c.instituicao}</p>
                  <p>{c.carga} — {c.ano}</p>
                </div>
              ))}
            </div>
          )}

          {perfil?.idiomas?.length > 0 && (
            <div className="secao-item">
              <h3>Idiomas</h3>
              {perfil.idiomas.map((i, idx) => (
                <p key={idx}><strong>{i.idioma}: </strong>{i.nivel}</p>
              ))}
            </div>
          )}

          {perfil?.habilidades?.length > 0 && (
            <div className="secao-item">
              <h3>Habilidades</h3>
              <div className="chips">
                {perfil.habilidades.map((h, i) => (
                  <span key={i} className="chip">{h.nome}</span>
                ))}
              </div>
            </div>
          )}

          {perfil?.links?.length > 0 && (
            <div className="secao-item">
              <h3>Links</h3>
              {perfil.links.map((l, i) => (
                <a key={i} href={l.url} className="link" target="_blank">
                  {l.nome}
                </a>
              ))}
            </div>
          )}

          {perfil?.anexos?.length > 0 && (
            <div className="secao-item">
              <h3>Anexos</h3>
              {perfil.anexos.map((a, i) => (
                <p key={i}><strong>{a.nome}</strong> — {a.tipo}</p>
              ))}
            </div>
          )}

        </section>

        {/* BLOCO DIREITO — INFORMAÇÕES DA VAGA */}
        <section className="secao bloco-dir">
          <h2>Informações da Vaga</h2>

          <p><strong>Vaga:</strong> {candidatura.vagaTitulo}</p>
          <p><strong>Empresa:</strong> {candidatura.empresa}</p>
          <p><strong>Status:</strong> {candidatura.status}</p>
          <p><strong>Data da candidatura:</strong> {candidatura.data}</p>

          {mostrarAcoes && (
            <div className="acoes-rh">

              {podeDefinirAnalise && (
                <button className="btn purple" onClick={definirAnalise}>
                  Definir como “Em análise”
                </button>
              )}

              {podeMarcarEntrevista && (
                <button className="btn primary" onClick={abrirEntrevista}>
                  Marcar entrevista
                </button>
              )}

              {podeReprovar && (
                <button className="btn danger" onClick={reprovarDireto}>
                  Reprovar
                </button>
              )}
            </div>
          )}

        </section>

      </div>

      {/* MODAIS */}
      <ModalMarcarEntrevista
        isOpen={modalMarcar.isOpen}
        candidatura={modalMarcar.data}
        onClose={() => { modalMarcar.close(); recarregar(); }}
        onSuccess={recarregar}
      />

      <ModalRecusarCandidato
        isOpen={modalRecusar.isOpen}
        candidatura={modalRecusar.data}
        onClose={() => { modalRecusar.close(); recarregar(); }}
      />
    </div>
  );
}
