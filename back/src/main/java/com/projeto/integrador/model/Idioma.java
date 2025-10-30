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
public class Idioma {
    @Id @GeneratedValue private Long id;
    private String nome;
    private String nivel; // Básico, Intermediário, Avançado, Fluente

    @ManyToOne
    private Candidato candidato;
}