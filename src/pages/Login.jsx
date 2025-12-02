import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/base/Login.css";

import { getUsers, setLoggedUser } from "../services/storageService";
import { api } from "../services/mockApi";

export default function Login({ setAuthenticated, setUserType }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (loading) return;
    setLoading(true);

    try {
      const users = getUsers() || [];

      // 🔐 1) valida credenciais pelo "users" (LEGADO)
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

      const emailLower = found.email.trim().toLowerCase();

      // 🔥 2) busca perfil REAL no mock_database
      let perfil = api.perfis.get(emailLower);

      // 🛠 3) se não existir perfil (caso CANDIDATO), cria automaticamente
      if (!perfil) {
        perfil = api.perfis.save(emailLower, {
          id: found.id,
          nome: found.nome,
          email: emailLower,
          tipoUsuario: found.tipoUsuario || "candidato",
          verificado: false,
        });
      }

      // 🔥 4) garante normalização correta do tipoUsuario
      const tipo = (perfil.tipoUsuario || found.tipoUsuario || "candidato").toLowerCase();

      // 🔥 5) salva APENAS o perfil REAL como usuário logado
      setLoggedUser({
        ...perfil,
        tipoUsuario: tipo,
      });

      setAuthenticated(true);
      setUserType(tipo);

      // 🔀 6) redireciona conforme o tipo
      navigate(tipo === "rh" ? "/dashboard" : "/home-candidato");

    } catch (err) {
      console.error(err);
      setErro("Erro ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">CarreiraLink</h1>
        <p className="login-subtitle">
          Acesse sua conta e continue sua jornada
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-link">
            Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
