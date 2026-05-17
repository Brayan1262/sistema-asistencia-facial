package com.brayan.asistencia.service;

import com.brayan.asistencia.model.Persona;
import com.brayan.asistencia.model.TipoPersona;
import com.brayan.asistencia.repository.PersonaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonaService {

    private final PersonaRepository personaRepository;

    public PersonaService(PersonaRepository personaRepository) {
        this.personaRepository = personaRepository;
    }

    public List<Persona> listarTodos() {
        return personaRepository.findAll();
    }

    public List<Persona> listarPorTipo(TipoPersona tipoPersona) {
        return personaRepository.findByTipoPersona(tipoPersona);
    }

    public Persona buscarPorId(Long id) {
        return personaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Persona no encontrada con ID: " + id));
    }

    public Persona registrar(Persona persona) {
        if (personaRepository.existsByDni(persona.getDni())) {
            throw new RuntimeException("Ya existe una persona con el DNI: " + persona.getDni());
        }

        validarPorTipo(persona);

        return personaRepository.save(persona);
    }

    public Persona actualizar(Long id, Persona datosActualizados) {
        Persona persona = buscarPorId(id);

        persona.setNombres(datosActualizados.getNombres());
        persona.setApellidos(datosActualizados.getApellidos());
        persona.setDni(datosActualizados.getDni());
        persona.setCorreo(datosActualizados.getCorreo());
        persona.setTelefono(datosActualizados.getTelefono());
        persona.setTipoPersona(datosActualizados.getTipoPersona());
        persona.setGrado(datosActualizados.getGrado());
        persona.setSeccion(datosActualizados.getSeccion());
        persona.setEspecialidad(datosActualizados.getEspecialidad());
        persona.setCargo(datosActualizados.getCargo());
        persona.setEstado(datosActualizados.getEstado());

        validarPorTipo(persona);

        return personaRepository.save(persona);
    }

    public Persona actualizarRostro(Long id, String rutaRostro) {
        Persona persona = buscarPorId(id);

        persona.setRutaRostro(rutaRostro);
        persona.setRostroRegistrado(true);

        return personaRepository.save(persona);
    }

    public void eliminar(Long id) {
        Persona persona = buscarPorId(id);
        personaRepository.delete(persona);
    }

    private void validarPorTipo(Persona persona) {
        if (persona.getTipoPersona() == TipoPersona.ESTUDIANTE) {
            if (persona.getGrado() == null || persona.getGrado().isBlank()
                    || persona.getSeccion() == null || persona.getSeccion().isBlank()) {
                throw new RuntimeException("El estudiante debe tener grado y sección.");
            }

            persona.setEspecialidad(null);
            persona.setCargo(null);
        }

        if (persona.getTipoPersona() == TipoPersona.DOCENTE) {
            if (persona.getEspecialidad() == null || persona.getEspecialidad().isBlank()
                    || persona.getCargo() == null || persona.getCargo().isBlank()) {
                throw new RuntimeException("El docente debe tener especialidad y cargo.");
            }

            persona.setGrado(null);
            persona.setSeccion(null);
        }
    }
}