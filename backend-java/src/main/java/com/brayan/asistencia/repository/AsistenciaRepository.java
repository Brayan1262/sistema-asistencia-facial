package com.brayan.asistencia.repository;

import com.brayan.asistencia.model.Asistencia;
import com.brayan.asistencia.model.Persona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AsistenciaRepository extends JpaRepository<Asistencia, Long> {

    List<Asistencia> findByPersona(Persona persona);

    List<Asistencia> findByFecha(LocalDate fecha);

    boolean existsByPersonaAndFecha(Persona persona, LocalDate fecha);
}