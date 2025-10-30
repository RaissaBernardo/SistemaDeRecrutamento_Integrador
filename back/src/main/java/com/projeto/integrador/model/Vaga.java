package com.projeto.integrador.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "vagas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String empresa;
    private String localizacao;
    private String modalidade; // Presencial, Híbrido, Remoto
    private String salario;
    private String tipoContrato; // CLT, PJ, etc.
    private String descricao;
    private String requisitos;
    private String beneficios;
    private String formatoJornada;
    private String filtrosRotulos; // JSON ou String separada
    private LocalDate dataPublicacao = LocalDate.now();
    private boolean ativa = true;
}