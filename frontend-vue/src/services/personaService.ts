import { apiJava } from "./api";

export type TipoPersona = "ESTUDIANTE" | "DOCENTE";

export type Persona = {
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
};

export async function listarPersonas() {
  const response = await apiJava.get<Persona[]>("/personas");
  return response.data;
}

export async function registrarPersona(persona: Persona) {
  const response = await apiJava.post<Persona>("/personas", persona);
  return response.data;
}

export async function actualizarPersona(id: number, persona: Persona) {
  const response = await apiJava.put<Persona>(`/personas/${id}`, persona);
  return response.data;
}

export async function obtenerPersonaPorId(id: number) {
  const response = await apiJava.get<Persona>(`/personas/${id}`);
  return response.data;
}