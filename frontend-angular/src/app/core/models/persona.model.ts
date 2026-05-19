export type TipoPersona = 'ESTUDIANTE' | 'DOCENTE';

export interface Persona {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  correo?: string;
  telefono?: string;
  tipoPersona: TipoPersona;
  grado?: string;
  seccion?: string;
  especialidad?: string;
  cargo?: string;
  estado: boolean;
  rostroRegistrado?: boolean;
  rutaRostro?: string;
  fechaRegistro?: string;
}