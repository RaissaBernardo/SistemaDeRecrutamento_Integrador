package com.projeto.integrador.controller;

import com.projeto.integrador.config.JwtService;
import com.projeto.integrador.model.*;
import com.projeto.integrador.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepo;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.senha())
        );
        var usuario = (Usuario) auth.getPrincipal();
        var token = jwtService.generateToken(usuario);
        return ResponseEntity.ok(new JwtResponse(token));
    }
}
record LoginDTO(String email, String senha) {}
record JwtResponse(String token) {}