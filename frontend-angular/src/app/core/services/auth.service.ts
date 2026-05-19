import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = signal(sessionStorage.getItem('sesionActiva') === 'true');

  constructor(private router: Router) {}

  login(usuario: string, password: string): boolean {
    if (usuario === 'admin' && password === 'admin123') {
      sessionStorage.setItem('sesionActiva', 'true');
      this.isLoggedIn.set(true);
      return true;
    }

    return false;
  }

  logout(): void {
    sessionStorage.removeItem('sesionActiva');
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  verificarSesion(): boolean {
    return sessionStorage.getItem('sesionActiva') === 'true';
  }
}