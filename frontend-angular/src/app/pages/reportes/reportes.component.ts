import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Persona } from '../../core/models/persona.model';
import { Asistencia, EstadoAsistencia } from '../../core/models/asistencia.model';
import { PersonaService } from '../../core/services/persona.service';
import { AsistenciaService } from '../../core/services/asistencia.service';

@Component({
  selector: 'app-reportes',
  imports: [FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {

  personas: Persona[] = [];
  asistencias: Asistencia[] = [];
  asistenciasFiltradas: Asistencia[] = [];

  cargando = true;
  error = '';
  mensaje = '';

  fechaInicio = '';
  fechaFin = '';
  tipoFiltro: 'TODOS' | 'ESTUDIANTE' | 'DOCENTE' = 'TODOS';
  estadoFiltro: 'TODOS' | EstadoAsistencia = 'TODOS';

  personaFaltaId: number | null = null;

  totalPersonas = 0;
  totalAsistenciasFiltradas = 0;
  totalEstudiantes = 0;
  totalDocentes = 0;
  totalPresentes = 0;
  totalTardanzas = 0;
  totalFaltas = 0;
  totalJustificados = 0;

  estadosDisponibles: EstadoAsistencia[] = [
    'PRESENTE',
    'TARDANZA',
    'FALTA',
    'JUSTIFICADO'
  ];

  constructor(
    private personaService: PersonaService,
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit(): void {
    const hoy = this.obtenerFechaActual();

    this.fechaInicio = hoy;
    this.fechaFin = hoy;

    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = '';
    this.mensaje = '';

    this.personaService.listarPersonas().subscribe({
      next: (personas) => {
        this.personas = personas;

        this.asistenciaService.listarAsistencias().subscribe({
          next: (asistencias) => {
            this.asistencias = asistencias;
            this.aplicarFiltros();
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
        this.error = 'No se pudieron cargar las personas. Verifica Spring Boot.';
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    this.error = '';
    this.mensaje = '';

    if (this.fechaInicio && this.fechaFin && this.fechaInicio > this.fechaFin) {
      this.error = 'La fecha de inicio no puede ser mayor que la fecha fin.';
      return;
    }

    this.asistenciasFiltradas = this.asistencias.filter((asistencia) => {
      const fecha = asistencia.fecha;

      const coincideFechaInicio = !this.fechaInicio || fecha >= this.fechaInicio;
      const coincideFechaFin = !this.fechaFin || fecha <= this.fechaFin;

      const coincideTipo =
        this.tipoFiltro === 'TODOS' ||
        asistencia.persona?.tipoPersona === this.tipoFiltro;

      const coincideEstado =
        this.estadoFiltro === 'TODOS' ||
        asistencia.estado === this.estadoFiltro;

      return coincideFechaInicio && coincideFechaFin && coincideTipo && coincideEstado;
    });

    this.calcularTotales();
    this.mensaje = `Se encontraron ${this.asistenciasFiltradas.length} asistencia(s).`;
  }

  limpiarFiltros(): void {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.tipoFiltro = 'TODOS';
    this.estadoFiltro = 'TODOS';
    this.aplicarFiltros();
  }

  registrarFaltaManual(): void {
    this.error = '';
    this.mensaje = '';

    if (!this.personaFaltaId) {
      this.error = 'Selecciona una persona activa para registrar falta.';
      return;
    }

    this.asistenciaService.registrarFalta(this.personaFaltaId).subscribe({
      next: () => {
        this.mensaje = 'Falta registrada correctamente.';
        this.personaFaltaId = null;
        this.cargarDatos();
      },
      error: (error) => {
        console.error(error);
        this.error =
          error?.error?.message ||
          'No se pudo registrar la falta. Puede que ya tenga asistencia hoy.';
      }
    });
  }

        cambiarEstadoAsistencia(asistencia: Asistencia, nuevoEstado: string): void {
     this.error = '';
     this.mensaje = '';

         const estadoValido = nuevoEstado as EstadoAsistencia;

     this.asistenciaService.cambiarEstado(asistencia.id, estadoValido).subscribe({
       next: () => {
       this.mensaje = `Estado actualizado a ${estadoValido}.`;
      this.cargarDatos();
    },
       error: (error) => {
         console.error(error);
         this.error =
           error?.error?.message ||
            'No se pudo cambiar el estado de la asistencia.';
    }
  });
}

  calcularTotales(): void {
    this.totalPersonas = this.personas.length;
    this.totalAsistenciasFiltradas = this.asistenciasFiltradas.length;

    this.totalEstudiantes = this.asistenciasFiltradas.filter(
      asistencia => asistencia.persona?.tipoPersona === 'ESTUDIANTE'
    ).length;

    this.totalDocentes = this.asistenciasFiltradas.filter(
      asistencia => asistencia.persona?.tipoPersona === 'DOCENTE'
    ).length;

    this.totalPresentes = this.asistenciasFiltradas.filter(
      asistencia => asistencia.estado === 'PRESENTE'
    ).length;

    this.totalTardanzas = this.asistenciasFiltradas.filter(
      asistencia => asistencia.estado === 'TARDANZA'
    ).length;

    this.totalFaltas = this.asistenciasFiltradas.filter(
      asistencia => asistencia.estado === 'FALTA'
    ).length;

    this.totalJustificados = this.asistenciasFiltradas.filter(
      asistencia => asistencia.estado === 'JUSTIFICADO'
    ).length;
  }

  obtenerPersonasActivas(): Persona[] {
    return this.personas.filter(persona => persona.estado);
  }

  obtenerAsistenciasOrdenadas(): Asistencia[] {
    return [...this.asistenciasFiltradas].reverse();
  }

  obtenerDetallePersona(persona?: Persona): string {
    if (!persona) {
      return '-';
    }

    if (persona.tipoPersona === 'ESTUDIANTE') {
      return `${persona.grado || 'Sin grado'} - Sección ${persona.seccion || '-'}`;
    }

    if (persona.tipoPersona === 'DOCENTE') {
      return `${persona.especialidad || 'Sin especialidad'} / ${persona.cargo || 'Sin cargo'}`;
    }

    return 'Sin detalle';
  }

  obtenerClaseEstado(estado: string): string {
    if (estado === 'PRESENTE') return 'badge-present';
    if (estado === 'TARDANZA') return 'badge-tardanza';
    if (estado === 'FALTA') return 'badge-falta';
    if (estado === 'JUSTIFICADO') return 'badge-justificado';
    return 'badge-method';
  }

  exportarExcel(): void {
    if (this.asistenciasFiltradas.length === 0) {
      this.error = 'No hay datos para exportar.';
      return;
    }

    let contenido = '\uFEFF';
    contenido += 'ID,Persona,Tipo,DNI,Fecha,Hora,Estado,Metodo\n';

    this.asistenciasFiltradas.forEach((asistencia) => {
      const persona = asistencia.persona;
      const nombreCompleto = `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim();

      contenido += [
        asistencia.id,
        this.limpiarCSV(nombreCompleto),
        persona?.tipoPersona || '',
        persona?.dni || '',
        asistencia.fecha || '',
        asistencia.hora || '',
        asistencia.estado || '',
        asistencia.metodoRegistro || ''
      ].join(',') + '\n';
    });

    const blob = new Blob([contenido], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = `reporte_asistencias_${this.obtenerFechaActual()}.csv`;
    enlace.click();

    URL.revokeObjectURL(url);

    this.mensaje = 'Reporte exportado correctamente. Puedes abrirlo con Excel.';
  }

  imprimirPDF(): void {
    if (this.asistenciasFiltradas.length === 0) {
      this.error = 'No hay datos para imprimir.';
      return;
    }

    let filas = '';

    this.asistenciasFiltradas.forEach((asistencia) => {
      const persona = asistencia.persona;
      const nombreCompleto = `${persona?.nombres || ''} ${persona?.apellidos || ''}`.trim();

      filas += `
        <tr>
          <td>${asistencia.id}</td>
          <td>${nombreCompleto}</td>
          <td>${persona?.tipoPersona || ''}</td>
          <td>${persona?.dni || ''}</td>
          <td>${asistencia.fecha || ''}</td>
          <td>${asistencia.hora || ''}</td>
          <td>${asistencia.estado || ''}</td>
          <td>${asistencia.metodoRegistro || ''}</td>
        </tr>
      `;
    });

    const ventana = window.open('', '_blank');

    if (!ventana) {
      this.error = 'El navegador bloqueó la ventana emergente para imprimir.';
      return;
    }

    ventana.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Asistencias</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 30px;
            color: #0f172a;
          }

          h1 {
            text-align: center;
            margin-bottom: 5px;
          }

          .subtitle {
            text-align: center;
            color: #64748b;
            margin-bottom: 25px;
          }

          .info {
            margin-bottom: 20px;
            padding: 12px;
            background: #eff6ff;
            border-radius: 8px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          th {
            background: #2563eb;
            color: white;
            padding: 9px;
            border: 1px solid #ddd;
          }

          td {
            padding: 8px;
            border: 1px solid #ddd;
          }

          tr:nth-child(even) {
            background: #f8fafc;
          }

          .footer {
            margin-top: 25px;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>Reporte de Asistencias</h1>
        <p class="subtitle">Sistema de Asistencia Facial</p>

        <div class="info">
          <strong>Fecha inicio:</strong> ${this.fechaInicio || 'Todas'}<br>
          <strong>Fecha fin:</strong> ${this.fechaFin || 'Todas'}<br>
          <strong>Tipo filtrado:</strong> ${this.tipoFiltro}<br>
          <strong>Estado filtrado:</strong> ${this.estadoFiltro}<br>
          <strong>Total registros:</strong> ${this.asistenciasFiltradas.length}
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Persona</th>
              <th>Tipo</th>
              <th>DNI</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Método</th>
            </tr>
          </thead>
          <tbody>
            ${filas}
          </tbody>
        </table>

        <div class="footer">
          Reporte generado automáticamente por el Sistema de Asistencia Facial.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);

    ventana.document.close();
    this.mensaje = 'Ventana de impresión abierta. Puedes guardar como PDF.';
  }

  limpiarCSV(valor: string): string {
    const texto = String(valor).replace(/"/g, '""');
    return `"${texto}"`;
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}