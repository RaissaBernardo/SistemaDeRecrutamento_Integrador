package com.projeto.integrador.controller;

import com.projeto.integrador.model.Vaga;
import com.projeto.integrador.service.VagaService;
import lombok.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vagas")
@RequiredArgsConstructor
public class VagaController {
    private final VagaService service;

    @GetMapping
    public List<Vaga> listar() { return service.listar(); }

    @GetMapping("/{id}")
    public Vaga buscar(@PathVariable Long id) { return service.buscar(id); }

    @PostMapping
    public Vaga criar(@RequestBody Vaga vaga) { return service.salvar(vaga); }

    @PutMapping("/{id}")
    public Vaga atualizar(@PathVariable Long id, @RequestBody Vaga vaga) {
        vaga.setId(id);
        return service.salvar(vaga);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) { service.deletar(id); }
}