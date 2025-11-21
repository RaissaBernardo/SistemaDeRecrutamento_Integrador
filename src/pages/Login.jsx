import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/base/Login.css";

import {
  getUsers,
  setLoggedUser
} from "../services/storageService";

export default function Login({ setAuthenticated, setUserType }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);









  

  // ============================
  // 🔐 SUBMIT LOGIN
  // ============================
  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (loading) return;
    setLoading(true);

    try {
      const users = getUsers() || [];

      const found = users.find(
        (u) =>
          u.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.senha === senha
      );

      if (!found) {
        setErro("Credenciais inválidas.");
        setLoading(false);
        return;
      }

      // padronização
      const tipo = (found.tipoUsuario || "candidato").toLowerCase();

      // salva sessão
      setLoggedUser({ ...found, tipoUsuario: tipo });

      // atualiza estado global
      setAuthenticated(true);
      setUserType(tipo);

      // redirecionamento
      navigate(tipo === "rh" ? "/dashboard" : "/home-candidato");

    } catch (err) {
      console.error(err);
      setErro("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* ==== LADO ESQUERDO ==== */}
      <div className="login-left">
        <h1>Bem-vindo ao Portal de Oportunidades</h1>
        <p>Acesse sua conta para continuar.</p>
      </div>

      {/* ==== LADO DIREITO ==== */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Acesso ao Sistema</h2>

          <label>E-mail</label>
          <input
            type="email"
            value={email}
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            value={senha}
            placeholder="Digite sua senha"
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <div className="error">{erro}</div>}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-links">
            <Link to="/cadastro">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
  
}
