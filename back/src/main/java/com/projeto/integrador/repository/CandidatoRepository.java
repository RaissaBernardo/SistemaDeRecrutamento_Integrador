package com.projeto.integrador.repository;

import com.projeto.integrador.model.Candidato;
import org.springframework.data.jpa.repository.JpaRepository;

// CandidatoRepository.java
public interface CandidatoRepository extends JpaRepository<Candidato, Long> {}
