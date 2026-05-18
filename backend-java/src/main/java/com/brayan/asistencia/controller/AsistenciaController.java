package com.brayan.asistencia.controller;

import com.brayan.asistencia.model.Asistencia;
import com.brayan.asistencia.model.EstadoAsistencia;
import com.brayan.asistencia.service.AsistenciaService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/asistencias")
@CrossOrigin(origins = "*")
public class AsistenciaController {

    private final AsistenciaService asistenciaService;

    public AsistenciaController(AsistenciaService asistenciaService) {
        this.asistenciaService = asistenciaService;
    }

    @GetMapping
    public List<Asistencia> listarTodas() {
        return asistenciaService.listarTodas();
    }

    @GetMapping("/fecha/{fecha}")
    public List<Asistencia> listarPorFecha(@PathVariable LocalDate fecha) {
        return asistenciaService.listarPorFecha(fecha);
    }

    @GetMapping("/persona/{personaId}")
    public List<Asistencia> listarPorPersona(@PathVariable Long personaId) {
        return asistenciaService.listarPorPersona(personaId);
    }

    @PostMapping("/marcar/{personaId}")
    public Asistencia marcarAsistencia(@PathVariable Long personaId) {
        return asistenciaService.marcarAsistencia(personaId);
    }

    @PostMapping("/falta/{personaId}")
    public Asistencia registrarFalta(@PathVariable Long personaId) {
        return asistenciaService.registrarFalta(personaId);
    }

    @PatchMapping("/{asistenciaId}/justificar")
    public Asistencia justificarAsistencia(@PathVariable Long asistenciaId) {
        return asistenciaService.justificarAsistencia(asistenciaId);
    }

    @PatchMapping("/{asistenciaId}/estado")
    public Asistencia cambiarEstado(
            @PathVariable Long asistenciaId,
            @RequestParam EstadoAsistencia estado
    ) {
        return asistenciaService.cambiarEstado(asistenciaId, estado);
    }
}