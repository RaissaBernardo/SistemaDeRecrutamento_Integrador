package com.projeto.integrador.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Set;

@Entity
@Table(name = "vaga") //nome da tabela no banco
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(name = "empresa_contratante")
    private String empresaContratante;

    private String localizacao;

    private String nivel;

    private BigDecimal salario;

    @Lob
    @Column(name = "descricao_detalhada", columnDefinition = "TEXT")
    private String descricaoDetalhada;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String requisitos;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vaga_beneficios", joinColumns = @JoinColumn(name = "vaga_id"))
    @Column(name = "beneficio")
    private Set<String> beneficios;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vaga_formatos", joinColumns = @JoinColumn(name = "vaga_id"))
    @Column(name = "formato_e_jornada")
    private Set<String> formatoEJornada;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vaga_palavras_chave", joinColumns = @JoinColumn(name = "vaga_id"))
    @Column(name = "palavra_chave")
    private Set<String> palavrasChave;
}
