import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {

  mensaje = '';

  admin: AdminPerfil = this.obtenerPerfilPorDefecto();

  ngOnInit(): void {
    this.cargarPerfil();
  }

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

      this.guardarPerfil(false);
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

  guardarPerfil(mostrarMensaje = true): void {
    localStorage.setItem('adminPerfilAngular', JSON.stringify(this.admin));

    window.dispatchEvent(new Event('adminPerfilActualizado'));

    if (mostrarMensaje) {
      this.mensaje = 'Perfil actualizado correctamente.';

      setTimeout(() => {
        this.mensaje = '';
      }, 3500);
    }
  }

  restaurarPerfil(): void {
    const confirmar = confirm('¿Restaurar datos del administrador a los valores por defecto?');

    if (!confirmar) {
      return;
    }

    localStorage.removeItem('adminPerfilAngular');
    this.admin = this.obtenerPerfilPorDefecto();

    this.guardarPerfil(false);

    this.mensaje = 'Perfil restaurado correctamente.';

    setTimeout(() => {
      this.mensaje = '';
    }, 3500);
  }

  seleccionarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.mensaje = 'Selecciona una imagen válida.';
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      this.admin.foto = String(reader.result);
      this.guardarPerfil();
    };

    reader.readAsDataURL(file);
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

  obtenerPerfilPorDefecto(): AdminPerfil {
    return {
      nombres: 'Brayan Jair',
      apellidos: 'Chavez Oscor',
      correo: 'admin@colegio.edu.pe',
      institucion: 'Colegio Digital',
      cargo: 'Administrador',
      telefono: '+51 987654321',
      descripcion: 'Bienvenido al panel administrativo del sistema de asistencia facial.',
      foto: null
    };
  }
}