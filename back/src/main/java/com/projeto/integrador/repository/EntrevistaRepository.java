package com.projeto.integrador.repository;

import com.projeto.integrador.model.Entrevista;
import org.springframework.data.jpa.repository.JpaRepository;

// EntrevistaRepository.java
public interface EntrevistaRepository extends JpaRepository<Entrevista, Long> {
}
