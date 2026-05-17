package com.brayan.asistencia.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "asistencias")
public class Asistencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "persona_id")
    private Persona persona;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(nullable = false)
    private LocalTime hora;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private String metodoRegistro;

    private LocalDateTime fechaRegistro;

    public Asistencia() {
    }

    @PrePersist
    public void prePersist() {
        this.fechaRegistro = LocalDateTime.now();

        if (this.fecha == null) {
            this.fecha = LocalDate.now();
        }

        if (this.hora == null) {
            this.hora = LocalTime.now();
        }

        if (this.estado == null) {
            this.estado = "PRESENTE";
        }

        if (this.metodoRegistro == null) {
            this.metodoRegistro = "RECONOCIMIENTO_FACIAL";
        }
    }

    public Long getId() {
        return id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getMetodoRegistro() {
        return metodoRegistro;
    }

    public void setMetodoRegistro(String metodoRegistro) {
        this.metodoRegistro = metodoRegistro;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }
}