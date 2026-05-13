import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'perfil',
    component: PerfilUsuarioComponent
  },

  {
    path: 'owner-dashboard',
    component: OwnerDashboardComponent
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent
  },

  {
    path: 'driver-dashboard',
    component: DriverDashboardComponent
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];