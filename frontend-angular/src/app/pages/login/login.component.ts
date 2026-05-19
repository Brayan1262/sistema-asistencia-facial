import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  usuario = '';
  password = '';
  mostrarPassword = false;
  error = '';
  temaOscuro = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarTema();
  }

  iniciarSesion(): void {
    this.error = '';

    if (!this.usuario.trim() || !this.password.trim()) {
      this.error = 'Completa usuario y contraseña.';
      return;
    }

    const loginCorrecto = this.authService.login(
      this.usuario.trim(),
      this.password.trim()
    );

    if (!loginCorrecto) {
      this.error = 'Usuario o contraseña incorrectos.';
      return;
    }

    this.router.navigate(['/']);
  }

  cargarTema(): void {
    const temaGuardado = localStorage.getItem('temaPanelAngular');
    this.temaOscuro = temaGuardado === 'oscuro';
    this.aplicarTema();
  }

  cambiarTema(): void {
    this.temaOscuro = !this.temaOscuro;

    localStorage.setItem(
      'temaPanelAngular',
      this.temaOscuro ? 'oscuro' : 'claro'
    );

    this.aplicarTema();
  }

  aplicarTema(): void {
    if (this.temaOscuro) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}