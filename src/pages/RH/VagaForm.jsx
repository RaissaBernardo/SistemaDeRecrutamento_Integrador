import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/rh/VagaForm.css";
import * as storageService from "../../services/storageService";

const readVagas = () => {
  if (storageService && typeof storageService.getVagas === "function") {
    return storageService.getVagas() || [];
  }
  return JSON.parse(localStorage.getItem("vagas") || "[]");
};

const writeVagas = (vagas) => {
  if (storageService && typeof storageService.saveVagas === "function") {
    storageService.saveVagas(vagas);
    return;
  }
  localStorage.setItem("vagas", JSON.stringify(vagas));
};

const emptyVaga = () => ({
  id: null,
  titulo: "",
  empresa: "",
  localizacao: "",
  modalidade: "Presencial",
  salario: "",
  logo: "",
  descricao: "",
  requisitos: "",
  beneficios: [],
  formato: {
    remoto: false,
    presencial: true,
    hibrido: false,
    periodoIntegral: false,
  },
});

export default function VagaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vaga, setVaga] = useState(emptyVaga());
  const [benefitInput, setBenefitInput] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const vagas = readVagas();
    if (id) {
      const found = vagas.find((v) => String(v.id) === String(id));
      if (found) {
        setVaga(found);
        setIsEdit(true);
      }
    }
  }, [id]);

  const handleFormatoToggle = (key) => {
    setVaga((prev) => ({
      ...prev,
      formato: { ...prev.formato, [key]: !prev.formato[key] },
    }));
  };

  const addBenefit = () => {
    const txt = benefitInput.trim();
    if (!txt) return;
    if (vaga.beneficios.includes(txt)) {
      setMessage({ type: "error", text: "Benefício já adicionado." });
      return;
    }
    setVaga((prev) => ({
      ...prev,
      beneficios: [...prev.beneficios, txt],
    }));
    setBenefitInput("");
    setMessage(null);
  };

  const removeBenefit = (b) => {
    setVaga((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((x) => x !== b),
    }));
  };

  // 🔹 Upload e conversão de imagem para base64
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setVaga((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!vaga.titulo.trim() || !vaga.empresa.trim()) {
      setMessage({
        type: "error",
        text: "Preencha pelo menos título e empresa.",
      });
      return;
    }

    const vagas = readVagas();
    if (isEdit && vaga.id) {
      const updated = vagas.map((v) =>
        String(v.id) === String(vaga.id) ? vaga : v
      );
      writeVagas(updated);
      setMessage({ type: "success", text: "Vaga atualizada com sucesso." });
    } else {
      const newVaga = { ...vaga, id: Date.now() };
      vagas.unshift(newVaga);
      writeVagas(vagas);
      setMessage({ type: "success", text: "Vaga criada com sucesso." });
      setTimeout(() => navigate("/vagas"), 700);
    }
  };

  const handleDelete = () => {
    if (!isEdit || !vaga.id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta vaga?")) return;
    const vagas = readVagas().filter(
      (v) => String(v.id) !== String(vaga.id)
    );
    writeVagas(vagas);
    navigate("/vagas");
  };

  return (
    <div className="vaga-form-page">
      {/* 🔹 Cabeçalho dinâmico visual */}
      <div className="vaga-form-banner">
        <div className="banner-left">
          {isEdit ? (
            <h1>
              ✏️ Editando vaga: <span>{vaga.titulo || "Sem título"}</span>
            </h1>
          ) : (
            <h1>📝 Cadastrar nova vaga</h1>
          )}
        </div>

        <div className="banner-right">
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => navigate("/vagas")}
          >
            ← Voltar
          </button>
        </div>
      </div>

      <div className="vaga-form">
        <form onSubmit={handleSave}>
          <div className="form-row two-col">
            <div className="form-group">
              <label>Título da vaga *</label>
              <input
                type="text"
                value={vaga.titulo}
                onChange={(e) =>
                  setVaga({ ...vaga, titulo: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Empresa contratante *</label>
              <input
                type="text"
                value={vaga.empresa}
                onChange={(e) =>
                  setVaga({ ...vaga, empresa: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Localização</label>
              <input
                type="text"
                value={vaga.localizacao}
                onChange={(e) =>
                  setVaga({ ...vaga, localizacao: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Salário</label>
              <input
                type="text"
                value={vaga.salario}
                onChange={(e) =>
                  setVaga({ ...vaga, salario: e.target.value })
                }
              />
            </div>
          </div>

          {/* 🔹 Campo de logo com upload */}
          <div className="form-row two-col">
            <div className="form-group">
              <label>Modalidade</label>
              <select
                value={vaga.modalidade}
                onChange={(e) =>
                  setVaga({ ...vaga, modalidade: e.target.value })
                }
              >
                <option>Presencial</option>
                <option>Remoto</option>
                <option>Híbrido</option>
              </select>
            </div>

            <div className="form-group">
              <label>Logo da empresa</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />
              {vaga.logo && (
                <div className="logo-preview">
                  <img
                    src={vaga.logo}
                    alt="Logo da empresa"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "contain",
                      marginTop: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      background: "#fff",
                      boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 🔹 Detalhes da vaga */}
          <section className="card details-card">
            <h2>Detalhes da vaga</h2>

            <div className="form-group full">
              <label>Descrição detalhada</label>
              <textarea
                value={vaga.descricao}
                onChange={(e) =>
                  setVaga({ ...vaga, descricao: e.target.value })
                }
              />
            </div>

            <div className="form-group full">
              <label>Requisitos</label>
              <textarea
                value={vaga.requisitos}
                onChange={(e) =>
                  setVaga({ ...vaga, requisitos: e.target.value })
                }
              />
            </div>

            <div className="form-group full">
              <label>Benefícios</label>
              <div className="benefits-controls">
                <input
                  placeholder="Adicionar benefício (ex: Vale-refeição)"
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter"
                      ? (e.preventDefault(), addBenefit())
                      : null
                  }
                />
                <button
                  type="button"
                  className="btn ghost"
                  onClick={addBenefit}
                >
                  Adicionar
                </button>
              </div>

              <div className="benefits-list">
                {vaga.beneficios.length === 0 ? (
                  <div className="help">Nenhum benefício adicionado.</div>
                ) : (
                  vaga.beneficios.map((b) => (
                    <span key={b} className="chip">
                      <span className="chip-text">{b}</span>
                      <button
                        type="button"
                        className="chip-remove"
                        onClick={() => removeBenefit(b)}
                        aria-label={`Remover ${b}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="form-group full">
              <label>Formato e Jornada</label>
              <div className="checkbox-group">
                {["remoto", "presencial", "hibrido", "periodoIntegral"].map(
                  (key) => (
                    <label key={key} className="checkbox-chip">
                      <input
                        type="checkbox"
                        checked={vaga.formato[key]}
                        onChange={() => handleFormatoToggle(key)}
                      />
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                  )
                )}
              </div>
            </div>
          </section>

          {message && (
            <div
              className={`alert ${
                message.type === "success" ? "success" : "error"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="form-actions">
            <button className="btn primary" type="submit">
              {isEdit ? "Salvar alterações" : "Salvar"}
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn delete"
                onClick={handleDelete}
              >
                Excluir vaga
              </button>
            )}
            <button
              type="button"
              className="btn ghost"
              onClick={() => navigate("/vagas")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
