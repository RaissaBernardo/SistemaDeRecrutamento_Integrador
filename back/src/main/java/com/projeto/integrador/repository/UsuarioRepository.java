package com.projeto.integrador.repository;

import com.projeto.integrador.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// UsuarioRepository.java
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
}

