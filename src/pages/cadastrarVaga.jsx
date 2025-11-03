import React, { useState } from "react";
import "../styles/Pages.css";
import "../styles/cadastrarVaga.css";

export default function CadastrarVaga() {
    const [formData, setFormData] = useState({
        titulo: "",
        empresa: "",
        localizacao: "",
        salario: "",
        modalidade: "",
        descricao: "",
        requisitos: "",
        beneficios: [],
        formato: "Presencial",
        palavrasChave: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Vaga cadastrada:", formData);
        alert("✅ Vaga publicada com sucesso!");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="pagina">
            <h2>📄 Cadastrar nova Vaga</h2>

            <form className="formulario-vaga" onSubmit={handleSubmit}>
                <h3>Dados da Vaga</h3>

                <label>Título da vaga*</label>
                <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    required
                />

                <label>Empresa contratante*</label>
                <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    required
                />

                <div className="linha-dupla">
                    <div>
                        <label>Localização*</label>
                        <input
                            type="text"
                            name="localizacao"
                            value={formData.localizacao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Salário</label>
                        <input
                            type="text"
                            name="salario"
                            value={formData.salario}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <label>Modalidade*</label>
                <select
                    name="modalidade"
                    value={formData.modalidade}
                    onChange={handleChange}
                    required
                >
                    <option value="">Selecione...</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                </select>

                <h3>Detalhes da Vaga</h3>

                <label>Descrição detalhada</label>
                <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                />

                <label>Requisitos</label>
                <textarea
                    name="requisitos"
                    value={formData.requisitos}
                    onChange={handleChange}
                    rows={3}
                />

                <label>Benefícios</label>
                <input
                    type="text"
                    placeholder="Digite os benefícios separados por vírgula"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            beneficios: e.target.value.split(","),
                        })
                    }
                />

                <h4>Formato e Jornada</h4>
                <div className="botoes-formato">
                    {["Remoto", "Presencial", "Híbrido"].map((tipo) => (
                        <button
                            type="button"
                            key={tipo}
                            className={
                                formData.formato === tipo ? "botao-verde ativo" : "botao-cinza"
                            }
                            onClick={() => setFormData({ ...formData, formato: tipo })}
                        >
                            {tipo}
                        </button>
                    ))}
                </div>

                <h4>Filtros e Palavras-chave</h4>
                <input
                    type="text"
                    placeholder="Ex: Tecnologia, RH, Atendimento..."
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            palavrasChave: e.target.value.split(","),
                        })
                    }
                />

                <div className="botoes-modal">
                    <button type="button" className="botao-cinza" onClick={() => window.history.back()}>
                        Cancelar
                    </button>
                    <button type="submit" className="botao-verde">
                        Publicar Vaga
                    </button>
                </div>
            </form>
        </div>
    );
}
