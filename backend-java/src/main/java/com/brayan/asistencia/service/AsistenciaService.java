package com.brayan.asistencia.service;

import com.brayan.asistencia.exception.ApiException;
import com.brayan.asistencia.model.Asistencia;
import com.brayan.asistencia.model.EstadoAsistencia;
import com.brayan.asistencia.model.Persona;
import com.brayan.asistencia.repository.AsistenciaRepository;
import com.brayan.asistencia.repository.PersonaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
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

        LocalTime horaActual = LocalTime.now();
        EstadoAsistencia estadoCalculado = calcularEstadoAsistencia(horaActual);

        Asistencia asistencia = new Asistencia();
        asistencia.setPersona(persona);
        asistencia.setFecha(hoy);
        asistencia.setHora(horaActual);
        asistencia.setEstado(estadoCalculado);
        asistencia.setMetodoRegistro("RECONOCIMIENTO_FACIAL");

        return asistenciaRepository.save(asistencia);
    }

    public Asistencia registrarFalta(Long personaId) {
        Persona persona = buscarPersona(personaId);
        LocalDate hoy = LocalDate.now();

        if (asistenciaRepository.existsByPersonaAndFecha(persona, hoy)) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "Esta persona ya tiene una asistencia registrada hoy."
            );
        }

        Asistencia asistencia = new Asistencia();
        asistencia.setPersona(persona);
        asistencia.setFecha(hoy);
        asistencia.setHora(LocalTime.now());
        asistencia.setEstado(EstadoAsistencia.FALTA);
        asistencia.setMetodoRegistro("REGISTRO_MANUAL");

        return asistenciaRepository.save(asistencia);
    }

    public Asistencia justificarAsistencia(Long asistenciaId) {
        Asistencia asistencia = asistenciaRepository.findById(asistenciaId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Asistencia no encontrada con ID: " + asistenciaId
                ));

        asistencia.setEstado(EstadoAsistencia.JUSTIFICADO);
        asistencia.setMetodoRegistro("JUSTIFICACION_ADMIN");

        return asistenciaRepository.save(asistencia);
    }

    public Asistencia cambiarEstado(Long asistenciaId, EstadoAsistencia nuevoEstado) {
        Asistencia asistencia = asistenciaRepository.findById(asistenciaId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Asistencia no encontrada con ID: " + asistenciaId
                ));

        asistencia.setEstado(nuevoEstado);

        if (nuevoEstado == EstadoAsistencia.JUSTIFICADO) {
            asistencia.setMetodoRegistro("JUSTIFICACION_ADMIN");
        }

        return asistenciaRepository.save(asistencia);
    }

    private EstadoAsistencia calcularEstadoAsistencia(LocalTime horaActual) {
        LocalTime horaLimite = LocalTime.of(8, 10);

        if (horaActual.isAfter(horaLimite)) {
            return EstadoAsistencia.TARDANZA;
        }

        return EstadoAsistencia.PRESENTE;
    }

    private Persona buscarPersona(Long personaId) {
        return personaRepository.findById(personaId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "Persona no encontrada con ID: " + personaId
                ));
    }
}