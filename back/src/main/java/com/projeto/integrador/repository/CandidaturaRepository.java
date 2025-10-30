package com.projeto.integrador.repository;

import com.projeto.integrador.model.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// CandidaturaRepository.java
public interface CandidaturaRepository extends JpaRepository<Candidatura, Long> {
    List<Candidatura> findByVagaId(Long vagaId);
}
