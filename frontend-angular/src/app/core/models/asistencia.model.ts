import { Persona } from './persona.model';

export type EstadoAsistencia = 'PRESENTE' | 'TARDANZA' | 'FALTA' | 'JUSTIFICADO';

export interface Asistencia {
  id: number;
  fecha: string;
  hora: string;
  estado: EstadoAsistencia;
  metodoRegistro: string;
  fechaRegistro?: string;
  persona?: Persona;
}