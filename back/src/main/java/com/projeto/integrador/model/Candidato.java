package com.projeto.integrador.model;

import lombok.*;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "candidatos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidato {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;
    private String telefone;
    private String linkedin;
    private String cidade;
    private String estado;

    @OneToMany(mappedBy = "candidato", cascade = CascadeType.ALL)
    private List<ExperienciaProfissional> experiencias;

    @OneToMany(mappedBy = "candidato", cascade = CascadeType.ALL)
    private List<FormacaoAcademica> formacoes;

    @OneToMany(mappedBy = "candidato", cascade = CascadeType.ALL)
    private List<Idioma> idiomas;

    @ElementCollection
    private List<String> habilidades;
}