package com.projeto.integrador.controller;

import com.projeto.integrador.model.Entrevista;
import com.projeto.integrador.service.EntrevistaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/entrevistas")
@RequiredArgsConstructor
public class EntrevistaController {
    private final EntrevistaService service;

    @PostMapping
    public Entrevista agendar(@RequestBody Entrevista e) {
        return service.agendar(e);
    }

    @PutMapping("/{id}/feedback")
    public Entrevista feedback(@PathVariable Long id, @RequestBody FeedbackDTO dto) {
        return service.salvarFeedback(id, dto.feedback());
    }
}
record FeedbackDTO(String feedback) {}