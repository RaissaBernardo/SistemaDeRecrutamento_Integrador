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
public class FormacaoAcademica {
    @Id @GeneratedValue private Long id;
    private String curso;
    private String instituicao;
    private String periodo;

    @ManyToOne
    private Candidato candidato;
}