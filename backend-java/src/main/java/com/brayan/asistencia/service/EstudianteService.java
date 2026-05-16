package com.brayan.asistencia.service;

import com.brayan.asistencia.model.Estudiante;
import com.brayan.asistencia.repository.EstudianteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;

    public EstudianteService(EstudianteRepository estudianteRepository) {
        this.estudianteRepository = estudianteRepository;
    }

    public List<Estudiante> listarTodos() {
        return estudianteRepository.findAll();
    }

    public Estudiante buscarPorId(Long id) {
        return estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con ID: " + id));
    }

    public Estudiante registrar(Estudiante estudiante) {
        if (estudianteRepository.existsByDni(estudiante.getDni())) {
            throw new RuntimeException("Ya existe un estudiante con el DNI: " + estudiante.getDni());
        }

        return estudianteRepository.save(estudiante);
    }

    public Estudiante actualizar(Long id, Estudiante datosActualizados) {
        Estudiante estudiante = buscarPorId(id);

        estudiante.setNombres(datosActualizados.getNombres());
        estudiante.setApellidos(datosActualizados.getApellidos());
        estudiante.setDni(datosActualizados.getDni());
        estudiante.setGrado(datosActualizados.getGrado());
        estudiante.setSeccion(datosActualizados.getSeccion());
        estudiante.setEstado(datosActualizados.getEstado());

        return estudianteRepository.save(estudiante);
    }

    public void eliminar(Long id) {
        Estudiante estudiante = buscarPorId(id);
        estudianteRepository.delete(estudiante);
    }
}