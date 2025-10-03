import React from "react";
import "../styles/Login.css";

export default function Login() {
  return (
    <div className="login-wrapper">
      {/* Lado esquerdo */}
      <div className="login-left">
        <h1>Bem-Vindo ao<br />Portal de Oportunidades</h1>
        <p>Acesse sua conta para visualizar vagas e candidaturas.</p>
      </div>

      {/* Lado direito (formulário) */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <input
                type="text"
                id="username"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>

            <p className="login-footer">
              Esqueceu sua senha? <a href="#">Recuperar</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
