import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Persona } from '../../core/models/persona.model';
import { Asistencia } from '../../core/models/asistencia.model';
import { PersonaService } from '../../core/services/persona.service';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { FacialService } from '../../core/services/facial.service';

@Component({
  selector: 'app-asistencia',
  imports: [],
  templateUrl: './asistencia.component.html',
  styleUrl: './asistencia.component.css'
})
export class AsistenciaComponent implements OnInit, OnDestroy {

  @ViewChild('videoCamara') videoCamara!: ElementRef<HTMLVideoElement>;

  fotoAsistencia: File | null = null;
  fotoCapturada: File | null = null;
  previewUrl = '';

  resultadoPersona: Persona | null = null;
  resultadoConfidence: number | null = null;

  asistencias: Asistencia[] = [];

  mensaje = '';
  error = '';
  procesando = false;
  cargandoAsistencias = true;

  usarCamara = false;
  camaraActiva = false;
  streamCamara: MediaStream | null = null;

  constructor(
    private personaService: PersonaService,
    private asistenciaService: AsistenciaService,
    private facialService: FacialService
  ) {}

  ngOnInit(): void {
    this.cargarAsistencias();
  }

  ngOnDestroy(): void {
    this.detenerCamara();
  }

  seleccionarImagen(event: Event): void {
    this.limpiarMensajes();

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.fotoCapturada = null;

    if (!file) {
      this.fotoAsistencia = null;
      this.previewUrl = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.error = 'Selecciona un archivo de imagen válido.';
      this.fotoAsistencia = null;
      this.previewUrl = '';
      input.value = '';
      return;
    }

    this.fotoAsistencia = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  reconocerPersona(): void {
    this.limpiarMensajes();

    this.resultadoPersona = null;
    this.resultadoConfidence = null;

    const imagen = this.fotoCapturada || this.fotoAsistencia;

    if (!imagen) {
      this.error = 'Selecciona una imagen o captura una foto con la cámara.';
      return;
    }

    this.procesando = true;
    this.mensaje = 'Analizando rostro, espera un momento...';

    this.facialService.reconocerRostro(imagen).subscribe({
      next: (data) => {
        if (!data.recognized || !data.personaId) {
          this.error = data.message || 'No se reconoció a la persona.';
          this.mensaje = '';
          this.procesando = false;
          return;
        }

        this.personaService.obtenerPersonaPorId(data.personaId).subscribe({
          next: (persona) => {
            this.resultadoPersona = persona;
            this.resultadoConfidence = data.confidence ?? null;

            if (!persona.estado) {
              this.mensaje = 'La persona fue reconocida, pero está inactiva. No se registró asistencia.';
              this.procesando = false;
              return;
            }

            this.registrarAsistencia(persona.id as number);
          },
          error: (error) => {
            console.error(error);
            this.error = 'Python reconoció la persona, pero Java no encontró sus datos.';
            this.mensaje = '';
            this.procesando = false;
          }
        });
      },
      error: (error) => {
        console.error(error);
        this.error =
          error?.error?.message ||
          'Error en el reconocimiento. Verifica que Python Flask esté encendido en http://localhost:5001.';
        this.mensaje = '';
        this.procesando = false;
      }
    });
  }

  registrarAsistencia(personaId: number): void {
    this.asistenciaService.marcarAsistencia(personaId).subscribe({
      next: (asistencia) => {
        this.mensaje = `Asistencia registrada correctamente. Estado: ${asistencia.estado}. Hora: ${asistencia.hora}`;
        this.procesando = false;
        this.cargarAsistencias();
      },
      error: (error) => {
        console.error(error);
        this.mensaje =
          error?.error?.message ||
          'La persona fue reconocida, pero no se pudo registrar la asistencia.';
        this.procesando = false;
      }
    });
  }

  cargarAsistencias(): void {
    this.cargandoAsistencias = true;

    this.asistenciaService.listarAsistencias().subscribe({
      next: (asistencias) => {
        this.asistencias = asistencias;
        this.cargandoAsistencias = false;
      },
      error: (error) => {
        console.error(error);
        this.cargandoAsistencias = false;
      }
    });
  }

  activarUsoCamara(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.usarCamara = input.checked;

    if (!this.usarCamara) {
      this.detenerCamara();
    }
  }

  async iniciarCamara(): Promise<void> {
    this.limpiarMensajes();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.error = 'El navegador no soporta acceso a cámara.';
        return;
      }

      this.streamCamara = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      if (this.videoCamara?.nativeElement) {
        this.videoCamara.nativeElement.srcObject = this.streamCamara;
      }

      this.camaraActiva = true;
      this.mensaje = 'Cámara iniciada correctamente.';
    } catch (error: any) {
      console.error(error);
      this.error = 'Permiso de cámara denegado o no disponible: ' + error.message;
    }
  }

  detenerCamara(): void {
    if (this.streamCamara) {
      this.streamCamara.getTracks().forEach(track => track.stop());
      this.streamCamara = null;
    }

    if (this.videoCamara?.nativeElement) {
      this.videoCamara.nativeElement.srcObject = null;
    }

    this.camaraActiva = false;
  }

  capturarFoto(): void {
    this.limpiarMensajes();

    if (!this.camaraActiva || !this.videoCamara?.nativeElement) {
      this.error = 'La cámara no está activa.';
      return;
    }

    const video = this.videoCamara.nativeElement;
    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    if (canvas.width === 0 || canvas.height === 0) {
      this.error = 'La cámara aún no está lista. Intenta nuevamente.';
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      this.error = 'No se pudo capturar la imagen.';
      return;
    }

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        this.error = 'Error al capturar la foto.';
        return;
      }

      const file = new File(
        [blob],
        `captura-asistencia-${Date.now()}.jpg`,
        { type: 'image/jpeg' }
      );

      this.fotoCapturada = file;
      this.fotoAsistencia = null;
      this.previewUrl = URL.createObjectURL(blob);

      const input = document.getElementById('fotoAsistenciaAngular') as HTMLInputElement | null;

      if (input) {
        input.value = '';
      }

      this.mensaje = 'Foto capturada correctamente. Ahora presiona Reconocer persona.';
    }, 'image/jpeg', 0.95);
  }

  limpiarImagen(): void {
    this.fotoAsistencia = null;
    this.fotoCapturada = null;
    this.previewUrl = '';
    this.resultadoPersona = null;
    this.resultadoConfidence = null;

    const input = document.getElementById('fotoAsistenciaAngular') as HTMLInputElement | null;

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

  obtenerClaseEstado(estado: string): string {
    if (estado === 'PRESENTE') return 'badge-present';
    if (estado === 'TARDANZA') return 'badge-tardanza';
    if (estado === 'FALTA') return 'badge-falta';
    if (estado === 'JUSTIFICADO') return 'badge-justificado';
    return 'badge-method';
  }

  obtenerAsistenciasOrdenadas(): Asistencia[] {
    return [...this.asistencias].reverse();
  }

  limpiarMensajes(): void {
    this.error = '';
    this.mensaje = '';
  }
}