import React, { useState } from "react";
import "../styles/Login.css";
import Cadastro from "./Cadastro";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login({ setAuthenticated }) {
  const [usuario, setUsuario] = useState(""); // pode ser e-mail ou nome de usuário
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulação de login: aceita nome "admin" ou e-mail "admin@teste.com"
    if (
      (usuario === "admin" || usuario === "admin@teste.com") &&
      senha === "123"
    ) {
      setAuthenticated(true);
      navigate("/dashboard");
    } else {
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="login-container">
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

      {/* Lado direito */}
      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Acesso ao Sistema de Recrutamento</h2>

          <label htmlFor="usuario">E-mail ou Usuário</label>
          <input
            id="usuario"
            type="text"
            placeholder="Digite seu e-mail ou nome de usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">Entrar</button>

          <div className="login-footer">
            <a href="#">Esqueceu a senha?</a>
            <p>
              Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
