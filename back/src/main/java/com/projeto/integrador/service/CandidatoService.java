package com.projeto.integrador.service;

import com.projeto.integrador.model.*;
import com.projeto.integrador.repository.*;
import lombok.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CandidatoService {
    private final CandidatoRepository repo;

    public Candidato buscar(Long id) {
        return repo.findById(id).orElseThrow();
    }
}