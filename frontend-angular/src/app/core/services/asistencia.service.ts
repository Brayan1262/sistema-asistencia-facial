import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Asistencia, EstadoAsistencia } from '../models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private apiUrl = 'http://localhost:8080/api/asistencias';

  constructor(private http: HttpClient) {}

  listarAsistencias(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(this.apiUrl);
  }

  marcarAsistencia(personaId: number): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.apiUrl}/marcar/${personaId}`, {});
  }

  registrarFalta(personaId: number): Observable<Asistencia> {
    return this.http.post<Asistencia>(`${this.apiUrl}/falta/${personaId}`, {});
  }

  cambiarEstado(asistenciaId: number, estado: EstadoAsistencia): Observable<Asistencia> {
    return this.http.patch<Asistencia>(
      `${this.apiUrl}/${asistenciaId}/estado?estado=${estado}`,
      {}
    );
  }
}