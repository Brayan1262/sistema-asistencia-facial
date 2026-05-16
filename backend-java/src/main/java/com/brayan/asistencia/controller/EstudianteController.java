package com.brayan.asistencia.controller;

import com.brayan.asistencia.model.Estudiante;
import com.brayan.asistencia.service.EstudianteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "*")
public class EstudianteController {

    private final EstudianteService estudianteService;

    public EstudianteController(EstudianteService estudianteService) {
        this.estudianteService = estudianteService;
    }

    @GetMapping
    public List<Estudiante> listarTodos() {
        return estudianteService.listarTodos();
    }

    @GetMapping("/{id}")
    public Estudiante buscarPorId(@PathVariable Long id) {
        return estudianteService.buscarPorId(id);
    }

    @PostMapping
    public Estudiante registrar(@RequestBody Estudiante estudiante) {
        return estudianteService.registrar(estudiante);
    }

    @PutMapping("/{id}")
    public Estudiante actualizar(@PathVariable Long id, @RequestBody Estudiante estudiante) {
        return estudianteService.actualizar(id, estudiante);
    }

    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return "Estudiante eliminado correctamente";
    }
}