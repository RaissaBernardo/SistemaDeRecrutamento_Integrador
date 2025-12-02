import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/base/Cadastro.css";

import { getUsers, saveUsers, setLoggedUser } from "../services/storageService";

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    cnpj: "",
    senha: "",
    confirmarSenha: "",
    tipo: "candidato",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // FORMATA CPF
  function formatarCPF(valor) {
    let v = valor.replace(/\D/g, "").slice(0, 11);
    if (v.length > 9)
      return v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return v;
  }

  // FORMATA CNPJ
  function formatarCNPJ(valor) {
    let v = valor.replace(/\D/g, "").slice(0, 14);
    if (v.length > 12)
      return v.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    if (v.length > 8)
      return v.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
    if (v.length > 5) return v.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
    if (v.length > 2) return v.replace(/(\d{2})(\d{1,3})/, "$1.$2");
    return v;
  }

  // ATUALIZA FORM
  function atualizar(campo, valor) {
    if (campo === "cpf") valor = formatarCPF(valor);
    if (campo === "cnpj") valor = formatarCNPJ(valor);
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validarCPF(c) {
    const s = c.replace(/\D/g, "");
    return s.length === 11;
  }

  function validarCNPJ(c) {
    const s = c.replace(/\D/g, "");
    return s.length === 14;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro("");

    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      return setErro("Preencha todos os campos obrigatórios.");
    }

    if (form.senha !== form.confirmarSenha) {
      return setErro("As senhas não coincidem.");
    }

    if (form.tipo === "candidato" && form.cpf && !validarCPF(form.cpf)) {
      return setErro("CPF inválido.");
    }

    if (form.tipo === "rh" && form.cnpj && !validarCNPJ(form.cnpj)) {
      return setErro("CNPJ inválido.");
    }

    const users = getUsers();
    const emailExiste = users.some(
      (u) => u.email.trim().toLowerCase() === form.email.trim().toLowerCase()
    );

    if (emailExiste) return setErro("Este e-mail já está cadastrado.");

    const novoUser = {
      id: Date.now(),
      nome: form.nome.trim(),
      email: form.email.trim().toLowerCase(),
      senha: form.senha,
      tipoUsuario: form.tipo,
      cpf: form.cpf.replace(/\D/g, ""),
      cnpj: form.cnpj.replace(/\D/g, ""),

      // 🔒 Sempre começa como false (RH e candidato)
      // Somente o RH será verificado depois, na tela de domínio.
      verificado: false,

      criadoEm: new Date().toISOString(),
    };

    // salva no "users" antigo (mantendo compatibilidade com seu login)
    saveUsers([...users, novoUser]);
    setLoggedUser(novoUser);

    // 🔥 RH precisa verificar domínio
    if (form.tipo === "rh") {
      navigate("/verificar-dominio", {
        state: {
          id: novoUser.id,
          nome: novoUser.nome,
          email: novoUser.email,   // 🔥 OBRIGATÓRIO AGORA
          dominio: form.email.split("@")[1],
          txtVerificacao: `portal-verification=${novoUser.id}`,
        },
      });
      return;
    }

    // candidato apenas vai para login
    navigate("/login");
  };

  const labelNome =
    form.tipo === "candidato" ? "Nome completo *" : "Nome da empresa *";
  const labelEmail =
    form.tipo === "candidato" ? "E-mail *" : "E-mail corporativo *";

  return (
    <div className="cadastro-page">
      <div className="cadastro-card">
        <h1 className="title">CarreiraLink</h1>
        <p className="subtitle">Crie sua conta e encontre oportunidades</p>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <label>
            {labelNome}
            <input
              type="text"
              value={form.nome}
              onChange={(e) => atualizar("nome", e.target.value)}
            />
          </label>

          <label>
            {labelEmail}
            <input
              type="email"
              value={form.email}
              onChange={(e) => atualizar("email", e.target.value)}
            />
          </label>

          {form.tipo === "candidato" ? (
            <label>
              CPF
              <input
                value={form.cpf}
                maxLength={14}
                onChange={(e) => atualizar("cpf", e.target.value)}
              />
            </label>
          ) : (
            <label>
              CNPJ da empresa
              <input
                value={form.cnpj}
                maxLength={18}
                onChange={(e) => atualizar("cnpj", e.target.value)}
              />
            </label>
          )}

          <div className="user-type">
            <span>Tipo de usuário</span>
            <div className="type-options">
              <label>
                <input
                  type="radio"
                  checked={form.tipo === "candidato"}
                  onChange={() => atualizar("tipo", "candidato")}
                />
                Candidato
              </label>

              <label>
                <input
                  type="radio"
                  checked={form.tipo === "rh"}
                  onChange={() => atualizar("tipo", "rh")}
                />
                RH / Empresa
              </label>
            </div>
          </div>

          <label>
            Senha *
            <input
              type="password"
              value={form.senha}
              onChange={(e) => atualizar("senha", e.target.value)}
            />
          </label>

          <label>
            Confirmar senha *
            <input
              type="password"
              value={form.confirmarSenha}
              onChange={(e) => atualizar("confirmarSenha", e.target.value)}
            />
          </label>

          {erro && <div className="error">{erro}</div>}

          <button className="btn-submit" disabled={loading}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <div className="login-link">
            Já tem conta? <Link to="/login">Entrar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
