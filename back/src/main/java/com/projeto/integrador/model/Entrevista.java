package com.projeto.integrador.model;

import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "entrevistas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Entrevista {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Candidatura candidatura;

    private LocalDateTime dataHora;
    private String tipo; // Presencial, Online
    private String local;
    private String entrevistador;
    private String observacoes;
    private String feedback;
    private boolean concluida = false;
}