import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/base/Cadastro.css";
import * as storageService from "../services/storageService";

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

  const validarCPF = (cpfRaw) => {
    const s = cpfRaw.replace(/\D/g, "");
    if (s.length !== 11 || /^(\d)\1+$/.test(s)) return false;
    return true;
  };

  const saveUser = (user) => {
    try {
      const users = storageService.getUsers?.() || [];
      storageService.saveUsers?.([...users, user]);
    } catch {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter ao menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (cpf && !validarCPF(cpf)) {
      setErro("CPF inválido. Insira 11 dígitos válidos.");
      return;
    }

    setLoading(true);

    const novoUser = {
      id: Date.now(),
      nome: nome.trim(),
      cpf: cpf.replace(/\D/g, ""),
      email: email.trim().toLowerCase(),
      senha,
      tipoUsuario: tipoUsuario.toLowerCase(), // 🔹 padronizado
      criadoEm: new Date().toISOString(),
    };

    try {
      saveUser(novoUser);
      if (storageService.setLoggedUser) {
        storageService.setLoggedUser(novoUser);
      }
      setTimeout(() => {
        setLoading(false);
        navigate("/login");
      }, 600);
    } catch (err) {
      setLoading(false);
      setErro("Erro ao cadastrar. Tente novamente.");
      console.error(err);
    }
  };

  const handleCpfChange = (v) => {
    const onlyDigits = v.replace(/\D/g, "");
    let formatted = onlyDigits;
    if (onlyDigits.length > 3 && onlyDigits.length <= 6) {
      formatted = `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3)}`;
    } else if (onlyDigits.length > 6 && onlyDigits.length <= 9) {
      formatted = `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3, 6)}.${onlyDigits.slice(6)}`;
    } else if (onlyDigits.length > 9) {
      formatted = `${onlyDigits.slice(0, 3)}.${onlyDigits.slice(3, 6)}.${onlyDigits.slice(6, 9)}-${onlyDigits.slice(9, 11)}`;
    }
    setCpf(formatted);
  };

  return (
    <div className="cad-page">
      <div className="cad-card" role="main" aria-labelledby="cad-title">
        <h2 id="cad-title" className="cad-title">
          Portal de Oportunidades — Cadastro
        </h2>

        <form className="cad-form" onSubmit={handleSubmit} noValidate>
          <div className="row">
            <label>
              Nome completo <span className="required">*</span>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
                required
                autoFocus
              />
            </label>

            <label>
              CPF
              <input
                inputMode="numeric"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </label>
          </div>

          <div className="row">
            <label>
              E-mail <span className="required">*</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </label>

            <label>
              Senha <span className="required">*</span>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="mínimo 6 caracteres"
                required
              />
            </label>
          </div>

          <div className="row">
            <label>
              Confirmar senha <span className="required">*</span>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="repita a senha"
                required
              />
            </label>

            <div className="tipo-usuario">
              <span>Tipo de usuário</span>
              <div className="radios">
                <label className="radio">
                  <input
                    type="radio"
                    name="tipo"
                    value="candidato"
                    checked={tipoUsuario === "candidato"}
                    onChange={() => setTipoUsuario("candidato")}
                  />
                  <span>Candidato</span>
                </label>

                <label className="radio">
                  <input
                    type="radio"
                    name="tipo"
                    value="rh"
                    checked={tipoUsuario === "rh"}
                    onChange={() => setTipoUsuario("rh")}
                  />
                  <span>RH</span>
                </label>
              </div>
            </div>
          </div>

          {erro && <div className="form-error" role="alert">{erro}</div>}

          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

            <div className="link-row">
              <span>Já tem conta?</span>
              <Link to="/login" className="link">Entrar</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
