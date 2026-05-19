import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

interface AdminPerfil {
  nombres: string;
  apellidos: string;
  correo: string;
  institucion: string;
  cargo: string;
  telefono: string;
  descripcion: string;
  foto: string | null;
}

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {

  temaOscuro = false;

  admin: AdminPerfil = {
    nombres: 'Brayan Jair',
    apellidos: 'Chavez Oscor',
    correo: 'admin@colegio.edu.pe',
    institucion: 'Colegio Digital',
    cargo: 'Administrador',
    telefono: '+51 987654321',
    descripcion: 'Bienvenido al panel administrativo del sistema de asistencia facial.',
    foto: null
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.verificarSesion()) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarPerfil();
    this.cargarTema();
  }

  @HostListener('window:adminPerfilActualizado')
  cargarPerfil(): void {
    const datosGuardados = localStorage.getItem('adminPerfilAngular');

    if (!datosGuardados) {
      return;
    }

    const datos = JSON.parse(datosGuardados);

    if (datos.nombre && !datos.nombres) {
      const partes = String(datos.nombre).split(' ');

      this.admin = {
        nombres: partes.slice(0, 2).join(' ') || 'Brayan Jair',
        apellidos: partes.slice(2).join(' ') || 'Chavez Oscor',
        correo: datos.correo || 'admin@colegio.edu.pe',
        institucion: datos.institucion || 'Colegio Digital',
        cargo: datos.cargo || 'Administrador',
        telefono: datos.telefono || '+51 987654321',
        descripcion: datos.descripcion || 'Bienvenido al panel administrativo del sistema de asistencia facial.',
        foto: datos.foto || null
      };

      return;
    }

    this.admin = {
      nombres: datos.nombres || 'Brayan Jair',
      apellidos: datos.apellidos || 'Chavez Oscor',
      correo: datos.correo || 'admin@colegio.edu.pe',
      institucion: datos.institucion || 'Colegio Digital',
      cargo: datos.cargo || 'Administrador',
      telefono: datos.telefono || '+51 987654321',
      descripcion: datos.descripcion || 'Bienvenido al panel administrativo del sistema de asistencia facial.',
      foto: datos.foto || null
    };
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

  cerrarSesion(): void {
    this.authService.logout();
  }

  obtenerIniciales(): string {
    const nombreCompleto = `${this.admin.nombres} ${this.admin.apellidos}`;

    return nombreCompleto
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(parte => parte.charAt(0).toUpperCase())
      .join('');
  }
}