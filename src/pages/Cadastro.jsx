import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/base/Cadastro.css";
import {
  getUsers,
  saveUsers,
  setLoggedUser
} from "../services/storageService";

export default function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("candidato");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // VALIDACAO CPF
  const validarCPF = (cpfRaw) => {
    const s = cpfRaw.replace(/\D/g, "");
    return s.length === 11 && !/^(\d)\1+$/.test(s);
  };

  // FORMATAR CPF
  const handleCpfChange = (v) => {
    const raw = v.replace(/\D/g, "");
    let f = raw;

    if (raw.length > 3 && raw.length <= 6)
      f = `${raw.slice(0, 3)}.${raw.slice(3)}`;
    else if (raw.length > 6 && raw.length <= 9)
      f = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    else if (raw.length > 9)
      f = `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;

    setCpf(f);
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email || !senha || !confirmarSenha)
      return setErro("Preencha todos os campos obrigatórios.");

    if (senha.length < 6)
      return setErro("A senha deve ter pelo menos 6 caracteres.");

    if (senha !== confirmarSenha)
      return setErro("As senhas não coincidem.");

    if (cpf && !validarCPF(cpf))
      return setErro("CPF inválido.");

    const users = getUsers();
    const emailJaExiste = users.some(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    );

    if (emailJaExiste)
      return setErro("Este e-mail já está cadastrado.");

    setLoading(true);

    const novoUser = {
      id: Date.now(),
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ""),
      email: email.trim().toLowerCase(),
      senha,
      tipoUsuario: tipoUsuario.toLowerCase(),
      criadoEm: new Date().toISOString()
    };

    try {
      saveUsers([...users, novoUser]);

      // Armazenar usuário apenas após cadastro
      setLoggedUser(novoUser);

      setTimeout(() => {
        navigate("/login");
      }, 400);
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cad-page">
      <div className="cad-card">
        <h2 className="cad-title">Portal de Oportunidades — Cadastro</h2>

        <form className="cad-form" onSubmit={handleSubmit} noValidate>

          <div className="row">
            <label>
              Nome completo *
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoFocus
              />
            </label>

            <label>
              CPF
              <input
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                maxLength={14}
              />
            </label>
          </div>

          <div className="row">
            <label>
              E-mail *
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label>
              Senha *
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Confirmar senha *
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </label>

            <div className="tipo-usuario">
              <span>Tipo de usuário</span>
              <div className="radios">
                <label className="radio">
                  <input
                    type="radio"
                    checked={tipoUsuario === "candidato"}
                    onChange={() => setTipoUsuario("candidato")}
                  />
                  Candidato
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    checked={tipoUsuario === "rh"}
                    onChange={() => setTipoUsuario("rh")}
                  />
                  RH
                </label>
              </div>
            </div>
          </div>

          {erro && <div className="form-error">{erro}</div>}

          <div className="actions">
            <button className="btn primary" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

            <div className="link-row">
              <span>Já tem conta?</span>
              <Link to="/login">Entrar</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
