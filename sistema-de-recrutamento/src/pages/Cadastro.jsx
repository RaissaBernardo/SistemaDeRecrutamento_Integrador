import React, { useState } from "react";
import "../styles/Cadastro.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nome || !cpf || !email || !senha || !confirmarSenha) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    if (!validarCPF(cpf)) {
      setMensagem("CPF inválido!");
      return;
    }

    if (senha !== confirmarSenha) {
      setMensagem("As senhas não coincidem!");
      return;
    }

    const dados = { nome, cpf, email, senha };
    console.log("Usuário cadastrado:", dados);
    setMensagem("Cadastro realizado com sucesso!");
    setNome("");
    setCpf("");
    setEmail("");
    setSenha("");
    setConfirmarSenha("");
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-left">
        <h1>
          Crie sua conta no
          <br />
          Portal de Oportunidades
        </h1>
        <p>
          Cadastre-se para acessar o sistema, acompanhar processos e receber
          novas oportunidades.
        </p>
      </div>

      <div className="cadastro-right">
        <form onSubmit={handleSubmit} className="cadastro-form">
          <h2>Cadastro de Novo Usuário</h2>

          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            type="text"
            placeholder="Digite seu CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <label htmlFor="confirmarSenha">Confirmar senha</label>
          <input
            id="confirmarSenha"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />

          <button type="submit">Cadastrar</button>

          <div className="cadastro-footer">
            <p>
              Já tem conta? <Link to="/login">Faça login</Link>
            </p>
          </div>
        </form>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}