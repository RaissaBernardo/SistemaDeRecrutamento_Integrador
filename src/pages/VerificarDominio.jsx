import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/mockApi"; // usar o mock central
import "../styles/base/VerificarDominio.css";

export default function VerificarDominio() {
  const navigate = useNavigate();
  const location = useLocation();

  // Garantir que sempre seja um objeto
  const empresa = location.state || {};

  const faltaDados =
    !empresa.id ||
    !empresa.nome ||
    !empresa.dominio ||
    !empresa.txtVerificacao;

  function validarDominio() {
    if (!faltaDados) {
      // Buscar o perfil da empresa no mock
      const perfil = api.perfis.get(empresa.email) || { email: empresa.email };

      // Marcar como verificado
      perfil.verificado = true;

      // Salvar no mock
      api.perfis.save(empresa.email, perfil);

      // Redirecionar com mensagem de sucesso
      navigate("/login", {
        state: { msg: "Domínio verificado com sucesso!" }
      });
    }
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
            <button className="btn primary" onClick={() => navigate("/cadastro")}>
              Voltar ao cadastro
            </button>
          </>
        ) : (
          <>
            <h2>Verificar domínio da empresa</h2>
            <p className="muted">
              Para garantir a autenticidade da organização, valide o domínio abaixo.
            </p>

            <div className="info-box">
              <p><strong>Empresa:</strong> {empresa.nome}</p>
              <p><strong>Domínio:</strong> {empresa.dominio}</p>

              <div className="txt-box">
                <label>Registro TXT simulado</label>
                <code className="txt">{empresa.txtVerificacao}</code>
              </div>
            </div>

            <button className="btn primary big" onClick={validarDominio}>
              Validar domínio
            </button>

            <p className="help">
              Esta é uma verificação simulada — usada apenas para fins acadêmicos.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
