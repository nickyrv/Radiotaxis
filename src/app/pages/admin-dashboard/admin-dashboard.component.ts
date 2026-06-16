import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { AdminOverviewComponent } from './components/admin-overview/admin-overview.component';
import { VehiclesManagementComponent } from './components/vehicles-management/vehicles-management.component';
import { DriversManagementComponent } from './components/drivers-management/drivers-management.component';
import { OwnersManagementComponent } from './components/owners-management/owners-management.component';
import { ShiftsManagementComponent } from './components/shifts-management/shifts-management.component';
import { AlertsManagementComponent } from './components/alerts-management/alerts-management.component';
import { PaymentsManagementComponent } from './components/payments-management/payments-management.component';
import { PerfilUsuarioComponent } from '../perfil-usuario/perfil-usuario.component';

type AdminView =
  | 'overview'
  | 'vehicles'
  | 'drivers'
  | 'owners'
  | 'shifts'
  | 'alerts'
  | 'payments'
  | 'profile' ;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AdminOverviewComponent,
    VehiclesManagementComponent,
    DriversManagementComponent,
    OwnersManagementComponent,
    ShiftsManagementComponent,
    AlertsManagementComponent,
    PaymentsManagementComponent

  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  currentView: AdminView = 'overview';

  sidebarOpen = false;

  windowWidth = window.innerWidth;

  user = {
    name: 'Administrador'
  };

  menuItems: { id: AdminView; label: string }[] = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'vehicles', label: 'Vehículos' },
    { id: 'drivers', label: 'Conductores' },
    { id: 'owners', label: 'Propietarios' },
    { id: 'shifts', label: 'Relevos' },
    { id: 'alerts', label: 'Alertas' },
    { id: 'payments', label: 'Pagos' }

  ];

  ngOnInit() {

    window.addEventListener('resize', () => {

      this.windowWidth = window.innerWidth;

    });

  }

  setView(view: AdminView) {

    this.currentView = view;

    this.sidebarOpen = false;

  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('failedAttempts');
    localStorage.removeItem('isBlocked');

    window.location.href = '/login';
  }

}