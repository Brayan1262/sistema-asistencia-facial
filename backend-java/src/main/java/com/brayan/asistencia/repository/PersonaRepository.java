package com.brayan.asistencia.repository;

import com.brayan.asistencia.model.Persona;
import com.brayan.asistencia.model.TipoPersona;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PersonaRepository extends JpaRepository<Persona, Long> {

    Optional<Persona> findByDni(String dni);

    boolean existsByDni(String dni);

    List<Persona> findByTipoPersona(TipoPersona tipoPersona);
}