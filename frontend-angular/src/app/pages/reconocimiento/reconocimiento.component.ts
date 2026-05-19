import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Persona } from '../../core/models/persona.model';
import { PersonaService } from '../../core/services/persona.service';
import { FacialService } from '../../core/services/facial.service';

@Component({
  selector: 'app-reconocimiento',
  imports: [FormsModule],
  templateUrl: './reconocimiento.component.html',
  styleUrl: './reconocimiento.component.css'
})
export class ReconocimientoComponent implements OnInit {

  personas: Persona[] = [];
  personasActivas: Persona[] = [];

  personaSeleccionadaId: number | null = null;
  personaSeleccionada: Persona | null = null;

  fotoRostro: File | null = null;
  previewUrl = '';

  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  constructor(
    private personaService: PersonaService,
    private facialService: FacialService
  ) {}

  ngOnInit(): void {
    this.cargarPersonas();
  }

  cargarPersonas(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.personaService.listarPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
        this.personasActivas = personas.filter(persona => persona.estado);
        this.actualizarPersonaSeleccionada();
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo cargar la lista de personas. Verifica que Spring Boot esté encendido.';
        this.cargando = false;
      }
    });
  }

  cambiarPersonaSeleccionada(): void {
    this.actualizarPersonaSeleccionada();
  }

  actualizarPersonaSeleccionada(): void {
    if (!this.personaSeleccionadaId) {
      this.personaSeleccionada = null;
      return;
    }

    this.personaSeleccionada = this.personas.find(
      persona => Number(persona.id) === Number(this.personaSeleccionadaId)
    ) || null;
  }

  seleccionarImagen(event: Event): void {
    this.limpiarMensajes();

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      this.fotoRostro = null;
      this.previewUrl = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error = 'Selecciona un archivo de imagen válido.';
      this.fotoRostro = null;
      this.previewUrl = '';
      input.value = '';
      return;
    }

    this.fotoRostro = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  registrarRostro(): void {
    this.limpiarMensajes();

    if (!this.personaSeleccionada?.id) {
      this.error = 'Selecciona una persona.';
      return;
    }

    if (!this.fotoRostro) {
      this.error = 'Selecciona una foto del rostro.';
      return;
    }

    if (!this.personaSeleccionada.estado) {
      this.error = 'No puedes registrar rostro a una persona inactiva.';
      return;
    }

    this.guardando = true;

    this.facialService.registrarRostro(
      this.personaSeleccionada.id,
      this.personaSeleccionada.tipoPersona,
      this.fotoRostro
    ).subscribe({
      next: (resultado) => {
        this.mensaje = `Rostro registrado correctamente. Archivo: ${resultado.filename}`;
        this.limpiarImagen();
        this.cargarPersonas();
        this.guardando = false;
      },
      error: (error) => {
        console.error(error);
        this.error =
          error?.error?.message ||
          'No se pudo registrar el rostro. Verifica que Python Flask esté encendido en http://localhost:5001.';
        this.guardando = false;
      }
    });
  }

  limpiarImagen(): void {
    this.fotoRostro = null;
    this.previewUrl = '';

    const input = document.getElementById('fotoRostroAngular') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }

  obtenerDetallePersona(persona: Persona): string {
    if (persona.tipoPersona === 'ESTUDIANTE') {
      return `${persona.grado || 'Sin grado'} - Sección ${persona.seccion || '-'}`;
    }

    if (persona.tipoPersona === 'DOCENTE') {
      return `${persona.especialidad || 'Sin especialidad'} / ${persona.cargo || 'Sin cargo'}`;
    }

    return 'Sin detalle';
  }

  limpiarMensajes(): void {
    this.error = '';
    this.mensaje = '';
  }
}