package com.projeto.integrador.service;

import com.projeto.integrador.model.Entrevista;
import com.projeto.integrador.repository.EntrevistaRepository;
import lombok.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EntrevistaService {
    private final EntrevistaRepository repo;

    public Entrevista agendar(Entrevista e) {
        return repo.save(e);
    }

    public Entrevista salvarFeedback(Long id, String feedback) {
        Entrevista e = repo.findById(id).orElseThrow();
        e.setFeedback(feedback);
        e.setConcluida(true);
        return repo.save(e);
    }

    public Entrevista buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrevista não encontrada: " + id));
    }
}