import React from "react";

export default function InlineForm({
  field,
  tempItem,
  atualizarTemp,
  salvarItem,
  cancelarForm,
}) {
  // Handler genérico
  const handle = (e) => atualizarTemp(e);

  return (
    <div className="inline-form">
      {/* ======================================================
          FORMAÇÃO
      ====================================================== */}
      {field === "formacao" && (
        <>
          <input
            name="curso"
            placeholder="Curso"
            value={tempItem.curso || ""}
            onChange={handle}
          />

          <input
            name="instituicao"
            placeholder="Instituição"
            value={tempItem.instituicao || ""}
            onChange={handle}
          />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input
                type="month"
                name="inicio"
                value={tempItem.inicio || ""}
                onChange={handle}
              />
            </div>

            <div>
              <label>Fim</label>
              <input
                type="month"
                name="fim"
                value={tempItem.fim || ""}
                onChange={handle}
              />
            </div>
          </div>

          <input
            name="status"
            placeholder="Status"
            value={tempItem.status || ""}
            onChange={handle}
          />
        </>
      )}

      {/* ======================================================
          EXPERIÊNCIAS
      ====================================================== */}
      {field === "experiencias" && (
        <>
          <input
            name="cargo"
            placeholder="Cargo"
            value={tempItem.cargo || ""}
            onChange={handle}
          />

          <input
            name="empresa"
            placeholder="Empresa"
            value={tempItem.empresa || ""}
            onChange={handle}
          />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input
                type="month"
                name="inicio"
                value={tempItem.inicio || ""}
                onChange={handle}
              />
            </div>

            <div>
              <label>Fim</label>
              <input
                type="month"
                name="fim"
                value={tempItem.fim || ""}
                onChange={handle}
              />
            </div>
          </div>

          <textarea
            name="descricao"
            placeholder="Descrição"
            value={tempItem.descricao || ""}
            onChange={handle}
          />
        </>
      )}

      {/* ======================================================
          CURSOS
      ====================================================== */}
      {field === "cursos" && (
        <>
          <input
            name="nome"
            placeholder="Nome"
            value={tempItem.nome || ""}
            onChange={handle}
          />

          <input
            name="instituicao"
            placeholder="Instituição"
            value={tempItem.instituicao || ""}
            onChange={handle}
          />

          <div className="grid-2">
            <input
              name="carga"
              placeholder="Carga horária"
              value={tempItem.carga || ""}
              onChange={handle}
            />

            <input
              name="ano"
              placeholder="Ano"
              value={tempItem.ano || ""}
              onChange={handle}
            />
          </div>
        </>
      )}

      {/* ======================================================
          IDIOMAS
      ====================================================== */}
      {field === "idiomas" && (
        <div className="grid-2">
          <input
            name="idioma"
            placeholder="Idioma"
            value={tempItem.idioma || ""}
            onChange={handle}
          />
          <input
            name="nivel"
            placeholder="Nível"
            value={tempItem.nivel || ""}
            onChange={handle}
          />
        </div>
      )}

      {/* ======================================================
          LINKS
      ====================================================== */}
      {field === "links" && (
        <>
          <input
            name="nome"
            placeholder="Nome"
            value={tempItem.nome || ""}
            onChange={handle}
          />

          <input
            name="url"
            placeholder="URL"
            value={tempItem.url || ""}
            onChange={handle}
          />
        </>
      )}

      {/* ======================================================
          ANEXOS — AGORA FUNCIONANDO DE VERDADE
      ====================================================== */}
      {field === "anexos" && (
        <>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const url = URL.createObjectURL(file);

              atualizarTemp({
                target: {
                  name: "arquivo",
                  value: {
                    nome: file.name,
                    tamanho: file.size,
                    tipo: file.type,
                    url,
                  },
                },
              });
            }}
          />

          {tempItem.arquivo && (
            <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
              📎 {tempItem.arquivo.nome} —
              {(tempItem.arquivo.tamanho / 1024).toFixed(1)} KB
            </p>
          )}
        </>
      )}

      {/* ======================================================
          HABILIDADES
      ====================================================== */}
      {field === "habilidades" && (
        <input
          name="nome"
          placeholder="Habilidade"
          value={tempItem.nome || ""}
          onChange={handle}
        />
      )}

      {/* BOTÕES */}
      <div className="form-buttons">
        <button className="btn ghost" onClick={cancelarForm}>
          Cancelar
        </button>

        <button className="btn primary" onClick={() => salvarItem(field)}>
          Adicionar
        </button>
      </div>
    </div>
  );
}
