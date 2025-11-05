import React, { useState } from "react";
import "../styles/base/Login.css";

import { useNavigate, Link } from "react-router-dom";
import { getUsers, setLoggedUser } from "../services/storageService";

export default function Login({ setAuthenticated, setUserType }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    const users = getUsers();
    const found = users.find((u) => u.email === email && u.senha === senha);
    if (!found) {
      setErro("Credenciais inválidas.");
      return;
    }

    setLoggedUser(found); // salva tipoUsuario junto
    setAuthenticated(true);
    setUserType(found.tipoUsuario);

    navigate(found.tipoUsuario === "RH" ? "/dashboard" : "/home-candidato");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Bem-vindo ao Portal de Oportunidades</h1>
        <p>Acesse sua conta para gerenciar vagas, candidaturas e entrevistas.</p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Acesso ao Sistema</h2>

          <label>E-mail</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

          <label>Senha</label>
          <input type="password" value={senha} onChange={(e)=>setSenha(e.target.value)} required />

          {erro && <div className="error">{erro}</div>}

          <button type="submit" className="btn primary">Entrar</button>

          <div className="login-links">
            <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
