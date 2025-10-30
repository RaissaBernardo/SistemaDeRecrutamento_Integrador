package com.projeto.integrador.service;


import com.projeto.integrador.model.Candidatura;
import com.projeto.integrador.repository.CandidaturaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CandidaturaService {

    private final CandidaturaRepository repo;

    // Método que faltava!
    public Candidatura buscar(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Candidatura não encontrada: " + id));
    }

    public List<Candidatura> listarPorVaga(Long vagaId) {
        return repo.findByVagaId(vagaId);
    }

    public Candidatura salvar(Candidatura c) {
        if (c.getDataCandidatura() == null) {
            c.setDataCandidatura(LocalDate.now());
        }
        return repo.save(c);
    }

    public void deletar(Long id) {
        repo.deleteById(id);
    }
}