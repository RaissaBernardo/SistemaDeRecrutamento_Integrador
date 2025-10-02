package com.projeto.integrador.service;

import com.projeto.integrador.entity.Vaga;
import com.projeto.integrador.repository.VagaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VagaService {

    private final VagaRepository vagaRepository;

    @Autowired
    public VagaService(VagaRepository vagaRepository) {
        this.vagaRepository = vagaRepository;
    }

    public Vaga criarVaga(Vaga vaga) {
        return vagaRepository.save(vaga);
    }

    public List<Vaga> buscarTodasVagas() {
        return vagaRepository.findAll();
    }

    public Optional<Vaga> buscarVagaPorId(Long id) {
        return vagaRepository.findById(id);
    }

    public Vaga atualizarVaga(Long id, Vaga vagaAtualizada) {
        return vagaRepository.findById(id).map(vagaExistente -> {
            vagaExistente.setTitulo(vagaAtualizada.getTitulo());
            vagaExistente.setSalario(vagaAtualizada.getSalario());
            vagaExistente.setEmpresaContratante(vagaAtualizada.getEmpresaContratante());
            vagaExistente.setLocalizacao(vagaAtualizada.getLocalizacao());
            vagaExistente.setNivel(vagaAtualizada.getNivel());
            vagaExistente.setDescricaoDetalhada(vagaAtualizada.getDescricaoDetalhada());
            vagaExistente.setRequisitos(vagaAtualizada.getRequisitos());
            vagaExistente.setBeneficios(vagaAtualizada.getBeneficios());
            vagaExistente.setFormatoEJornada(vagaAtualizada.getFormatoEJornada());
            vagaExistente.setPalavrasChave(vagaAtualizada.getPalavrasChave());

            return vagaRepository.save(vagaExistente);
        }).orElseThrow(() -> new RuntimeException("Vaga não encontrada com o ID: " + id));
    }

    public void deletarVaga(Long id) {
        vagaRepository.deleteById(id);
    }
}
