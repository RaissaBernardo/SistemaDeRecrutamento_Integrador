package com.projeto.integrador.controller;

import com.projeto.integrador.model.*;
import com.projeto.integrador.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidatos")
@RequiredArgsConstructor
public class CandidatoController {
    private final CandidatoService service;

    @GetMapping("/{id}")
    public Candidato perfil(@PathVariable Long id) {
        return service.buscar(id);
    }
}