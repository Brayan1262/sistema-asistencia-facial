package com.brayan.asistencia.repository;

import com.brayan.asistencia.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    Optional<Estudiante> findByDni(String dni);

    boolean existsByDni(String dni);
}