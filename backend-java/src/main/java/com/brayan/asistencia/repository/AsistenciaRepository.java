package com.brayan.asistencia.repository;

import com.brayan.asistencia.model.Asistencia;
import com.brayan.asistencia.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByFecha(LocalDate fecha);

    List<Asistencia> findByPersona(Persona persona);

    boolean existsByPersonaAndFecha(Persona persona, LocalDate fecha);

    Optional<Asistencia> findByPersonaAndFecha(Persona persona, LocalDate fecha);
}