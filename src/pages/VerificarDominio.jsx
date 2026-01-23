import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/mockApi"; // usar o mock central
import "../styles/base/VerificarDominio.css";

export default function VerificarDominio() {
  const navigate = useNavigate();
  const location = useLocation();

  // Garantir que sempre seja um objeto
  const empresa = location.state || {};

  // Agora também exigindo email para evitar perfil quebrado
  const faltaDados =
    !empresa.id ||
    !empresa.nome ||
    !empresa.dominio ||
    !empresa.txtVerificacao ||
    !empresa.email;

  function validarDominio() {
    if (faltaDados) return;

    // Buscar o perfil da empresa no mock (pelo MESMO e-mail usado no cadastro)
    const perfilExistente = api.perfis.get(empresa.email);

    const perfilAtualizado = {
      ...(perfilExistente || {}),
      id: perfilExistente?.id || empresa.id,
      nome: perfilExistente?.nome || empresa.nome,
      email: empresa.email,
      tipoUsuario: perfilExistente?.tipoUsuario || "rh",
      dominio: empresa.dominio,
      txtVerificacao: empresa.txtVerificacao,
      verificado: true,
    };

    // Salvar no mock (localStorage)
    api.perfis.save(empresa.email, perfilAtualizado);

    // (Opcional) registrar log
    // api.perfis.logs.add({
    //   tipo: "verificacao_dominio",
    //   dados: { email: empresa.email, dominio: empresa.dominio },
    //   usuario: empresa.email,
    // });

    // Redirecionar com mensagem de sucesso
    navigate("/login", {
      state: { msg: "Domínio verificado com sucesso! Faça login novamente." },
    });
  }

  return (
    <div className="verif-page">
      <div className="verif-card">
        {faltaDados ? (
          <>
            <h2>Falha na verificação</h2>
            <p className="muted">
              Não foi possível carregar as informações da empresa.
            </p>
            <button
              className="btn primary"
              onClick={() => navigate("/cadastro")}
            >
              Voltar ao cadastro
            </button>
          </>
        ) : (
          <>
            <h2>Verificar domínio da empresa</h2>
            <p className="muted">
              Para garantir a autenticidade da organização, valide o domínio
              abaixo.
            </p>

            <div className="info-box">
              <p>
                <strong>Empresa:</strong> {empresa.nome}
              </p>
              <p>
                <strong>E-mail:</strong> {empresa.email}
              </p>
              <p>
                <strong>Domínio:</strong> {empresa.dominio}
              </p>

              <div className="txt-box">
                <label>Registro TXT simulado</label>
                <code className="txt">{empresa.txtVerificacao}</code>
              </div>
            </div>

            <button className="btn primary big" onClick={validarDominio}>
              Validar domínio
            </button>

            <p className="help">
              Esta é uma verificação simulada — usada apenas para fins
              acadêmicos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
