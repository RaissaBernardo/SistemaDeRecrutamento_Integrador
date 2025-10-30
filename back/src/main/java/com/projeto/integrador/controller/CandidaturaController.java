package com.projeto.integrador.controller;

import com.projeto.integrador.model.Candidatura;
import com.projeto.integrador.service.CandidaturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidaturas")
@RequiredArgsConstructor
public class CandidaturaController {
    private final CandidaturaService service;

    @GetMapping("/vaga/{vagaId}")
    public List<Candidatura> porVaga(@PathVariable Long vagaId) {
        return service.listarPorVaga(vagaId);
    }

    @PostMapping
    public Candidatura criar(@RequestBody Candidatura c) {
        return service.salvar(c);
    }

    @PutMapping("/{id}/status")
    public Candidatura atualizarStatus(@PathVariable Long id, @RequestBody StatusDTO dto) {
        Candidatura c = service.buscar(id);
        c.setStatus(dto.status());
        return service.salvar(c);
    }
}
record StatusDTO(Candidatura.StatusCandidatura status) {}