import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PerfilUsuarioComponent } from './pages/perfil-usuario/perfil-usuario.component';
import { OwnerDashboardComponent } from './pages/owner-dashboard/owner-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DriverDashboardComponent } from './pages/driver-dashboard/driver-dashboard.component';

import { authGuard } from './guards/auth.guard';

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
    component: PerfilUsuarioComponent,
    canActivate: [authGuard]
  },

  {
    path: 'owner-dashboard',
    component: OwnerDashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: 'driver-dashboard',
    component: DriverDashboardComponent,
    canActivate: [authGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];