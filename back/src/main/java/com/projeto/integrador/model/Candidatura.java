package com.projeto.integrador.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "candidaturas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidatura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Vaga vaga;

    @ManyToOne
    private Candidato candidato;

    private LocalDate dataCandidatura = LocalDate.now();

    @Enumerated(EnumType.STRING)
    private StatusCandidatura status = StatusCandidatura.EM_ANALISE;

    public enum StatusCandidatura {
        EM_ANALISE, ENTREVISTA, APROVADO, REPROVADO, CONTRATADO
    }
}