import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // evita recarregar a página

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validação simples (pode substituir com backend depois)
    if (username === "admin" && password === "1234") {
      localStorage.setItem("user", username); // salva login
      navigate("/dashboard"); // redireciona para o Dashboard
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Lado esquerdo */}
      <div className="login-left">
        <h1>
          Bem-Vindo ao
          <br />
          Portal de Oportunidades
        </h1>
        <p>
          Faça login para acessar sua conta e acompanhar processos,
          candidaturas e mais.
        </p>
      </div>

      {/* Lado direito (formulário) */}
      <div className="login-right">
        <div className="login-card">
          <h2 className="login-title">Login</h2>
          <form className="login-form" onSubmit={handleLogin}>
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
