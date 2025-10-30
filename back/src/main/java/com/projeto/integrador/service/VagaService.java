package com.projeto.integrador.service;

import com.projeto.integrador.model.Vaga;
import com.projeto.integrador.repository.VagaRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VagaService {
    private final VagaRepository repo;

    public List<Vaga> listar() { return repo.findAll(); }
    public Vaga buscar(Long id) { return repo.findById(id).orElseThrow(); }
    public Vaga salvar(Vaga vaga) { return repo.save(vaga); }
    public void deletar(Long id) { repo.deleteById(id); }

}