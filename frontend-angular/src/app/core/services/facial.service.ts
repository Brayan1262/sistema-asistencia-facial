import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

import { PersonaService } from './persona.service';

export interface FaceRegisterResponse {
  message: string;
  path: string;
  filename: string;
}

export interface FaceRecognizeResponse {
  recognized: boolean;
  personaId?: number;
  confidence?: number;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FacialService {

  private apiFaceUrl = 'http://localhost:5001/api/faces';

  constructor(
    private http: HttpClient,
    private personaService: PersonaService
  ) {}

  registrarRostro(
    personaId: number,
    tipoPersona: string,
    image: File
  ): Observable<FaceRegisterResponse> {
    const formData = new FormData();

    formData.append('personaId', String(personaId));
    formData.append('tipoPersona', tipoPersona);
    formData.append('image', image);

    return this.http.post<FaceRegisterResponse>(
      `${this.apiFaceUrl}/register`,
      formData
    ).pipe(
      switchMap((responsePython) => {
        return this.personaService.actualizarRostro(
          personaId,
          responsePython.path
        ).pipe(
          switchMap(() => {
            return new Observable<FaceRegisterResponse>((observer) => {
              observer.next(responsePython);
              observer.complete();
            });
          })
        );
      })
    );
  }

  reconocerRostro(image: File): Observable<FaceRecognizeResponse> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http.post<FaceRecognizeResponse>(
      `${this.apiFaceUrl}/recognize`,
      formData
    );
  }
}