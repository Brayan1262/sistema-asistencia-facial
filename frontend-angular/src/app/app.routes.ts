import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PersonasComponent } from './pages/personas/personas.component';
import { ReconocimientoComponent } from './pages/reconocimiento/reconocimiento.component';
import { AsistenciaComponent } from './pages/asistencia/asistencia.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'personas',
        component: PersonasComponent
      },
      {
        path: 'reconocimiento',
        component: ReconocimientoComponent
      },
      {
        path: 'asistencia',
        component: AsistenciaComponent
      },
      {
        path: 'reportes',
        component: ReportesComponent
      },
      {
        path: 'perfil',
        component: PerfilComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];