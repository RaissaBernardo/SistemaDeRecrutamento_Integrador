import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/rh/VagaForm.css";

// 🔄 mockApi NOVO do modelo A (banco único)
import { api } from "../../services/mockApi";

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
  detalhes: {
    descricao: "",
    requisitos: "",
    beneficios: [],
    formatoJornada: {
      remoto: false,
      presencial: true,
      hibrido: false,
      periodoIntegral: false,
    },
    palavrasChave: []
  },
  dataPublicacao: new Date().toLocaleDateString("pt-BR")
});

export default function VagaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vaga, setVaga] = useState(emptyVaga());
  const [benefitInput, setBenefitInput] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [message, setMessage] = useState(null);

  // ============================
  // 🔄 Carregar vaga existente
  // ============================
  useEffect(() => {
    if (id) {
      const encontrada = api.vagas.getVaga(Number(id));
      if (encontrada) {
        setVaga(encontrada);
        setIsEdit(true);
      }
    }
  }, [id]);

  // ============================
  // 🔄 Toggle dos checkboxes
  // ============================
  const handleFormatoToggle = (key) => {
    setVaga((prev) => ({
      ...prev,
      formato: { ...prev.formato, [key]: !prev.formato[key] },
      detalhes: {
        ...prev.detalhes,
        formatoJornada: {
          ...prev.detalhes.formatoJornada,
          [key]: !prev.detalhes.formatoJornada[key]
        }
      }
    }));
  };

  // ============================
  // ➕ Benefícios
  // ============================
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
      detalhes: {
        ...prev.detalhes,
        beneficios: [...prev.detalhes.beneficios, txt]
      }
    }));

    setBenefitInput("");
    setMessage(null);
  };

  const removeBenefit = (b) => {
    setVaga((prev) => ({
      ...prev,
      beneficios: prev.beneficios.filter((x) => x !== b),
      detalhes: {
        ...prev.detalhes,
        beneficios: prev.detalhes.beneficios.filter((x) => x !== b)
      }
    }));
  };

  // ============================
  // 📷 Upload logo
  // ============================
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setVaga((prev) => ({ ...prev, logo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // ============================
  // 💾 Salvar vaga
  // ============================
  const handleSave = (e) => {
    e.preventDefault();

    if (!vaga.titulo.trim() || !vaga.empresa.trim()) {
      setMessage({
        type: "error",
        text: "Preencha pelo menos título e empresa.",
      });
      return;
    }

    if (isEdit) {
      api.vagas.updateVaga(vaga.id, vaga);
      setMessage({ type: "success", text: "Vaga atualizada com sucesso." });
      setTimeout(() => navigate("/vagas"), 700);
    } else {
      api.vagas.createVaga(vaga);
      setMessage({ type: "success", text: "Vaga criada com sucesso." });
      setTimeout(() => navigate("/vagas"), 700);
    }
  };

  // ============================
  // ❌ Deletar vaga
  // ============================
  const handleDelete = () => {
    if (!isEdit || !vaga.id) return;
    if (!window.confirm("Tem certeza que deseja excluir esta vaga?")) return;

    api.vagas.deleteVaga(vaga.id);
    navigate("/vagas");
  };

  // ============================
  // JSX
  // ============================
  return (
    <div className="vaga-form-page">
      {/* Banner */}
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
          {/* ------------ CAMPOS PRINCIPAIS ------------ */}
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

          {/* Modalidade / Logo */}
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
                    alt="Logo"
                  />
                </div>
              )}
            </div>
          </div>

          {/* ------------ DETALHES ------------ */}
          <section className="card details-card">
            <h2>Detalhes da vaga</h2>

            <div className="form-group full">
              <label>Descrição detalhada</label>
              <textarea
                value={vaga.descricao}
                onChange={(e) =>
                  setVaga({
                    ...vaga,
                    descricao: e.target.value,
                    detalhes: { ...vaga.detalhes, descricao: e.target.value }
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>Requisitos</label>
              <textarea
                value={vaga.requisitos}
                onChange={(e) =>
                  setVaga({
                    ...vaga,
                    requisitos: e.target.value,
                    detalhes: { ...vaga.detalhes, requisitos: e.target.value }
                  })
                }
              />
            </div>

            <div className="form-group full">
              <label>Benefícios</label>
              <div className="benefits-controls">
                <input
                  placeholder="Adicionar benefício"
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
            <div className={`alert ${message.type}`}>
              {message.text}
            </div>
          )}

          {/* Ações */}
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
