package com.projeto.integrador.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienciaProfissional {
    @Id
    @GeneratedValue
    private Long id;
    private String cargo;
    private String empresa;
    private String periodo; // "Jan 2020 - Dez 2023"
    private String descricao;

    @ManyToOne
    private Candidato candidato;
}