import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Persona, TipoPersona } from '../../core/models/persona.model';
import { PersonaService } from '../../core/services/persona.service';

@Component({
  selector: 'app-personas',
  imports: [FormsModule],
  templateUrl: './personas.component.html',
  styleUrl: './personas.component.css'
})
export class PersonasComponent implements OnInit {

  personas: Persona[] = [];
  personasFiltradas: Persona[] = [];

  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  filtroActual: 'TODOS' | TipoPersona = 'TODOS';

  personaEditandoId: number | null = null;
  estadoPersonaEditando = true;

  formulario: Persona = this.obtenerFormularioVacio();

  totalPersonas = 0;
  totalEstudiantes = 0;
  totalDocentes = 0;
  totalActivos = 0;

  constructor(private personaService: PersonaService) {}

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
        this.calcularTotales();
        this.aplicarFiltro(this.filtroActual);
        this.cargando = false;
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo cargar la lista de personas. Verifica que Spring Boot esté encendido.';
        this.cargando = false;
      }
    });
  }

  guardarPersona(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.validarFormulario()) {
      this.error = 'Completa los campos obligatorios según el tipo de persona.';
      return;
    }

    this.guardando = true;

    const personaPayload: Persona = {
      nombres: this.formulario.nombres.trim(),
      apellidos: this.formulario.apellidos.trim(),
      dni: this.formulario.dni.trim(),
      correo: this.formulario.correo?.trim() || '',
      telefono: this.formulario.telefono?.trim() || '',
      tipoPersona: this.formulario.tipoPersona,
      grado: this.formulario.tipoPersona === 'ESTUDIANTE'
        ? this.formulario.grado?.trim() || ''
        : '',
      seccion: this.formulario.tipoPersona === 'ESTUDIANTE'
        ? this.formulario.seccion?.trim() || ''
        : '',
      especialidad: this.formulario.tipoPersona === 'DOCENTE'
        ? this.formulario.especialidad?.trim() || ''
        : '',
      cargo: this.formulario.tipoPersona === 'DOCENTE'
        ? this.formulario.cargo?.trim() || ''
        : '',
      estado: this.personaEditandoId ? this.estadoPersonaEditando : true
    };

    if (this.personaEditandoId) {
      this.personaService.actualizarPersona(this.personaEditandoId, personaPayload).subscribe({
        next: () => {
          this.mensaje = 'Persona actualizada correctamente.';
          this.resetearFormulario();
          this.cargarPersonas();
          this.guardando = false;
        },
        error: (error) => {
          console.error(error);
          this.error = error?.error?.message || 'No se pudo actualizar la persona.';
          this.guardando = false;
        }
      });

      return;
    }

    this.personaService.registrarPersona(personaPayload).subscribe({
      next: () => {
        this.mensaje = 'Persona registrada correctamente.';
        this.resetearFormulario();
        this.cargarPersonas();
        this.guardando = false;
      },
      error: (error) => {
        console.error(error);
        this.error = error?.error?.message || 'No se pudo registrar la persona. Verifica que el DNI no esté repetido.';
        this.guardando = false;
      }
    });
  }

  editarPersona(persona: Persona): void {
    if (!persona.id) {
      return;
    }

    this.personaEditandoId = persona.id;
    this.estadoPersonaEditando = persona.estado;

    this.formulario = {
      nombres: persona.nombres || '',
      apellidos: persona.apellidos || '',
      dni: persona.dni || '',
      correo: persona.correo || '',
      telefono: persona.telefono || '',
      tipoPersona: persona.tipoPersona || 'ESTUDIANTE',
      grado: persona.grado || '',
      seccion: persona.seccion || '',
      especialidad: persona.especialidad || '',
      cargo: persona.cargo || '',
      estado: persona.estado
    };

    this.mensaje = `Editando a ${persona.nombres} ${persona.apellidos}.`;
    this.error = '';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  cambiarEstadoPersona(persona: Persona): void {
    if (!persona.id) {
      return;
    }

    const nuevoEstado = !persona.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';

    const confirmar = confirm(
      `¿Seguro que deseas ${accion} a ${persona.nombres} ${persona.apellidos}?`
    );

    if (!confirmar) {
      return;
    }

    const personaActualizada: Persona = {
      nombres: persona.nombres,
      apellidos: persona.apellidos,
      dni: persona.dni,
      correo: persona.correo || '',
      telefono: persona.telefono || '',
      tipoPersona: persona.tipoPersona,
      grado: persona.grado || '',
      seccion: persona.seccion || '',
      especialidad: persona.especialidad || '',
      cargo: persona.cargo || '',
      estado: nuevoEstado
    };

    this.personaService.actualizarPersona(persona.id, personaActualizada).subscribe({
      next: () => {
        this.mensaje = nuevoEstado
          ? 'Persona activada correctamente.'
          : 'Persona desactivada correctamente.';

        this.cargarPersonas();
      },
      error: (error) => {
        console.error(error);
        this.error = error?.error?.message || 'No se pudo cambiar el estado de la persona.';
      }
    });
  }

  cancelarEdicion(): void {
    this.resetearFormulario();
    this.mensaje = 'Edición cancelada.';
    this.error = '';
  }

  aplicarFiltro(filtro: 'TODOS' | TipoPersona): void {
    this.filtroActual = filtro;

    if (filtro === 'TODOS') {
      this.personasFiltradas = this.personas;
      return;
    }

    this.personasFiltradas = this.personas.filter(
      persona => persona.tipoPersona === filtro
    );
  }

  calcularTotales(): void {
    this.totalPersonas = this.personas.length;
    this.totalEstudiantes = this.personas.filter(p => p.tipoPersona === 'ESTUDIANTE').length;
    this.totalDocentes = this.personas.filter(p => p.tipoPersona === 'DOCENTE').length;
    this.totalActivos = this.personas.filter(p => p.estado).length;
  }

  validarFormulario(): boolean {
    if (!this.formulario.nombres.trim()) return false;
    if (!this.formulario.apellidos.trim()) return false;
    if (!this.formulario.dni.trim()) return false;

    if (this.formulario.tipoPersona === 'ESTUDIANTE') {
      return Boolean(
        this.formulario.grado?.trim() &&
        this.formulario.seccion?.trim()
      );
    }

    if (this.formulario.tipoPersona === 'DOCENTE') {
      return Boolean(
        this.formulario.especialidad?.trim() &&
        this.formulario.cargo?.trim()
      );
    }

    return true;
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

  resetearFormulario(): void {
    this.personaEditandoId = null;
    this.estadoPersonaEditando = true;
    this.formulario = this.obtenerFormularioVacio();
  }

  obtenerFormularioVacio(): Persona {
    return {
      nombres: '',
      apellidos: '',
      dni: '',
      correo: '',
      telefono: '',
      tipoPersona: 'ESTUDIANTE',
      grado: '',
      seccion: '',
      especialidad: '',
      cargo: '',
      estado: true
    };
  }
}