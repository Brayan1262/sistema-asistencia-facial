package com.brayan.asistencia.controller;

import com.brayan.asistencia.model.Persona;
import com.brayan.asistencia.model.TipoPersona;
import com.brayan.asistencia.service.PersonaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "*")
public class PersonaController {

    private final PersonaService personaService;

    public PersonaController(PersonaService personaService) {
        this.personaService = personaService;
    }

    @GetMapping
    public List<Persona> listarTodos() {
        return personaService.listarTodos();
    }

    @GetMapping("/{id}")
    public Persona buscarPorId(@PathVariable Long id) {
        return personaService.buscarPorId(id);
    }

    @GetMapping("/tipo/{tipoPersona}")
    public List<Persona> listarPorTipo(@PathVariable TipoPersona tipoPersona) {
        return personaService.listarPorTipo(tipoPersona);
    }

    @PostMapping
    public Persona registrar(@RequestBody Persona persona) {
        return personaService.registrar(persona);
    }

    @PutMapping("/{id}")
    public Persona actualizar(@PathVariable Long id, @RequestBody Persona persona) {
        return personaService.actualizar(id, persona);
    }

    @PatchMapping("/{id}/rostro")
    public Persona actualizarRostro(@PathVariable Long id, @RequestParam String rutaRostro) {
        return personaService.actualizarRostro(id, rutaRostro);
    }

    @DeleteMapping("/{id}")
    public String eliminar(@PathVariable Long id) {
        personaService.eliminar(id);
        return "Persona eliminada correctamente";
    }
}