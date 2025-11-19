import React from "react";

export default function InlineForm({
  field,
  tempItem,
  atualizarTemp,
  salvarItem,
  cancelarForm
}) {
  return (
    <div className="inline-form">

      {/* =================== FORMAÇÃO =================== */}
      {field === "formacao" && (
        <>
          <input name="curso" placeholder="Curso" onChange={atualizarTemp} />
          <input name="instituicao" placeholder="Instituição" onChange={atualizarTemp} />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input type="month" name="inicio" onChange={atualizarTemp} />
            </div>

            <div>
              <label>Fim</label>
              <input type="month" name="fim" onChange={atualizarTemp} />
            </div>
          </div>

          <input name="status" placeholder="Status (Concluído / Cursando)" onChange={atualizarTemp} />
        </>
      )}

      {/* =================== EXPERIÊNCIAS =================== */}
      {field === "experiencias" && (
        <>
          <input name="cargo" placeholder="Cargo" onChange={atualizarTemp} />
          <input name="empresa" placeholder="Empresa" onChange={atualizarTemp} />

          <div className="grid-2">
            <div>
              <label>Início</label>
              <input type="month" name="inicio" onChange={atualizarTemp} />
            </div>

            <div>
              <label>Fim</label>
              <input type="month" name="fim" onChange={atualizarTemp} />
            </div>
          </div>

          <textarea
            name="descricao"
            placeholder="Descrição das atividades"
            onChange={atualizarTemp}
          />
        </>
      )}

      {/* =================== CURSOS =================== */}
      {field === "cursos" && (
        <>
          <input name="nome" placeholder="Nome do curso" onChange={atualizarTemp} />
          <input name="instituicao" placeholder="Instituição" onChange={atualizarTemp} />

          <div className="grid-2">
            <input name="carga" placeholder="Carga horária" onChange={atualizarTemp} />
            <input name="ano" placeholder="Ano" onChange={atualizarTemp} />
          </div>
        </>
      )}

      {/* =================== IDIOMAS =================== */}
      {field === "idiomas" && (
        <div className="grid-2">
          <input name="idioma" placeholder="Idioma" onChange={atualizarTemp} />
          <input name="nivel" placeholder="Nível (Básico, Intermediário...)" onChange={atualizarTemp} />
        </div>
      )}

      {/* =================== LINKS =================== */}
      {field === "links" && (
        <>
          <input name="nome" placeholder="Nome (LinkedIn, GitHub...)" onChange={atualizarTemp} />
          <input name="url" placeholder="URL" onChange={atualizarTemp} />
        </>
      )}

      {/* =================== ANEXOS =================== */}
      {field === "anexos" && (
        <>
          <input name="nome" placeholder="Nome do arquivo" onChange={atualizarTemp} />
          <input name="tipo" placeholder="Tipo (PDF, JPG...)" onChange={atualizarTemp} />
        </>
      )}

      {/* =================== HABILIDADES =================== */}
      {field === "habilidades" && (
        <input
          name="nome"
          placeholder="Habilidade (ex: Java, Comunicação...)"
          onChange={atualizarTemp}
        />
      )}

      {/* =================== BOTÕES =================== */}
      <div className="form-buttons">
        <button className="btn ghost" onClick={cancelarForm}>Cancelar</button>
        <button className="btn primary" onClick={() => salvarItem(field)}>Adicionar</button>
      </div>
    </div>
  );
}
