package com.brayan.asistencia.service;

import com.brayan.asistencia.exception.ApiException;
import com.brayan.asistencia.model.Asistencia;
import com.brayan.asistencia.model.Persona;
import com.brayan.asistencia.repository.AsistenciaRepository;
import com.brayan.asistencia.repository.PersonaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AsistenciaService {

    private final AsistenciaRepository asistenciaRepository;
    private final PersonaRepository personaRepository;

    public AsistenciaService(AsistenciaRepository asistenciaRepository, PersonaRepository personaRepository) {
        this.asistenciaRepository = asistenciaRepository;
        this.personaRepository = personaRepository;
    }

    public List<Asistencia> listarTodas() {
        return asistenciaRepository.findAll();
    }

    public List<Asistencia> listarPorFecha(LocalDate fecha) {
        return asistenciaRepository.findByFecha(fecha);
    }

    public List<Asistencia> listarPorPersona(Long personaId) {
        Persona persona = buscarPersona(personaId);
        return asistenciaRepository.findByPersona(persona);
    }

    public Asistencia marcarAsistencia(Long personaId) {
        Persona persona = buscarPersona(personaId);

        if (!Boolean.TRUE.equals(persona.getRostroRegistrado())) {
            throw new ApiException(
                    HttpStatus.BAD_REQUEST,
                    "La persona no tiene rostro registrado."
            );
        }

        LocalDate hoy = LocalDate.now();

        if (asistenciaRepository.existsByPersonaAndFecha(persona, hoy)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "La asistencia de esta persona ya fue registrada hoy."
            );
        }

        Asistencia asistencia = new Asistencia();
        asistencia.setPersona(persona);
        asistencia.setEstado("PRESENTE");
        asistencia.setMetodoRegistro("RECONOCIMIENTO_FACIAL");

        return asistenciaRepository.save(asistencia);
    }

    private Persona buscarPersona(Long personaId) {
        return personaRepository.findById(personaId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Persona no encontrada con ID: " + personaId
                ));
    }
}