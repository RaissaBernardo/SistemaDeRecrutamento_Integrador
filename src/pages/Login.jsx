import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/base/Login.css";
import { getUsers, setLoggedUser } from "../services/storageService";

export default function Login({ setAuthenticated, setUserType }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Submeter formulário de login
  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    // 🔸 Evita múltiplos envios
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

      // 🔹 Padroniza tipo de usuário
      const tipo = found.tipoUsuario?.toLowerCase?.() || "candidato";

      // 🔹 Salva no storage
      setLoggedUser({ ...found, tipoUsuario: tipo });

      // 🔹 Atualiza sessão global
      setAuthenticated(true);
      setUserType(tipo);

      // 🔹 Redireciona para o painel correto
      navigate(tipo === "rh" ? "/dashboard" : "/home-candidato");
    } catch (err) {
      console.error(err);
      setErro("Erro ao tentar fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ==================== LADO ESQUERDO ==================== */}
      <div className="login-left">
        <h1>Bem-vindo ao Portal de Oportunidades</h1>
        <p>Acesse sua conta para gerenciar vagas, candidaturas e entrevistas.</p>
      </div>

      {/* ==================== LADO DIREITO (FORMULÁRIO) ==================== */}
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <h2>Acesso ao Sistema</h2>

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoFocus
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            required
          />

          {erro && (
            <div className="error" role="alert">
              {erro}
            </div>
          )}

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-links">
            <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
