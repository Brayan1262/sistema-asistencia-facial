import { Component, OnInit } from '@angular/core';

import { Persona } from '../../core/models/persona.model';
import { Asistencia } from '../../core/models/asistencia.model';
import { PersonaService } from '../../core/services/persona.service';
import { AsistenciaService } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  personas: Persona[] = [];
  asistencias: Asistencia[] = [];

  cargando = true;
  error = '';

  totalPersonas = 0;
  totalEstudiantes = 0;
  totalDocentes = 0;
  totalActivos = 0;
  totalRostros = 0;
  totalAsistenciasHoy = 0;

  constructor(
    private personaService: PersonaService,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.cargando = true;
    this.error = '';

    this.personaService.listarPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;
        this.calcularPersonas();

        this.asistenciaService.listarAsistencias().subscribe({
          next: (asistencias) => {
            this.asistencias = asistencias;
            this.calcularAsistencias();
            this.cargando = false;
          },
          error: (error) => {
            console.error(error);
            this.error = 'No se pudieron cargar las asistencias.';
            this.cargando = false;
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.error = 'No se pudo conectar con Spring Boot. Verifica http://localhost:8080.';
        this.cargando = false;
      }
    });
  }

  calcularPersonas(): void {
    this.totalPersonas = this.personas.length;
    this.totalEstudiantes = this.personas.filter(p => p.tipoPersona === 'ESTUDIANTE').length;
    this.totalDocentes = this.personas.filter(p => p.tipoPersona === 'DOCENTE').length;
    this.totalActivos = this.personas.filter(p => p.estado).length;
    this.totalRostros = this.personas.filter(p => p.rostroRegistrado).length;
  }

  calcularAsistencias(): void {
    const hoy = this.obtenerFechaActual();

    this.totalAsistenciasHoy = this.asistencias.filter(a => a.fecha === hoy).length;
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}