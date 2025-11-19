import React from "react";

export default function InlineForm({
  field,
  tempItem,
  atualizarTemp,
  salvarItem,
  cancelarForm
}) {
  const handle = (e) => atualizarTemp(e);

  return (
    <div className="inline-form">

      {field === "formacao" && (
        <>
          <input name="curso" placeholder="Curso" value={tempItem.curso || ""} onChange={handle} />
          <input name="instituicao" placeholder="Instituição" value={tempItem.instituicao || ""} onChange={handle} />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input type="month" name="inicio" value={tempItem.inicio || ""} onChange={handle} />
            </div>

            <div>
              <label>Fim</label>
              <input type="month" name="fim" value={tempItem.fim || ""} onChange={handle} />
            </div>
          </div>

          <input name="status" placeholder="Status" value={tempItem.status || ""} onChange={handle} />
        </>
      )}

      {field === "experiencias" && (
        <>
          <input name="cargo" placeholder="Cargo" value={tempItem.cargo || ""} onChange={handle} />
          <input name="empresa" placeholder="Empresa" value={tempItem.empresa || ""} onChange={handle} />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input type="month" name="inicio" value={tempItem.inicio || ""} onChange={handle} />
            </div>

            <div>
              <label>Fim</label>
              <input type="month" name="fim" value={tempItem.fim || ""} onChange={handle} />
            </div>
          </div>

          <textarea name="descricao" placeholder="Descrição" value={tempItem.descricao || ""} onChange={handle} />
        </>
      )}

      {field === "cursos" && (
        <>
          <input name="nome" placeholder="Nome" value={tempItem.nome || ""} onChange={handle} />
          <input name="instituicao" placeholder="Instituição" value={tempItem.instituicao || ""} onChange={handle} />

          <div className="grid-2">
            <input name="carga" placeholder="Carga horária" value={tempItem.carga || ""} onChange={handle} />
            <input name="ano" placeholder="Ano" value={tempItem.ano || ""} onChange={handle} />
          </div>
        </>
      )}

      {field === "idiomas" && (
        <div className="grid-2">
          <input name="idioma" placeholder="Idioma" value={tempItem.idioma || ""} onChange={handle} />
          <input name="nivel" placeholder="Nível" value={tempItem.nivel || ""} onChange={handle} />
        </div>
      )}

      {field === "links" && (
        <>
          <input name="nome" placeholder="Nome" value={tempItem.nome || ""} onChange={handle} />
          <input name="url" placeholder="URL" value={tempItem.url || ""} onChange={handle} />
        </>
      )}

      {field === "anexos" && (
        <>
          <input name="nome" placeholder="Nome do arquivo" value={tempItem.nome || ""} onChange={handle} />
          <input name="tipo" placeholder="Tipo" value={tempItem.tipo || ""} onChange={handle} />
        </>
      )}

      {field === "habilidades" && (
        <input name="nome" placeholder="Habilidade" value={tempItem.nome || ""} onChange={handle} />
      )}

      <div className="form-buttons">
        <button className="btn ghost" onClick={cancelarForm}>Cancelar</button>
        <button className="btn primary" onClick={() => salvarItem(field)}>Adicionar</button>
      </div>
    </div>
  );
}
