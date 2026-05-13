import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AdminOverviewComponent } from './components/admin-overview/admin-overview.component';
import { VehiclesManagementComponent } from './components/vehicles-management/vehicles-management.component';
import { DriversManagementComponent } from './components/drivers-management/drivers-management.component';
import { OwnersManagementComponent } from './components/owners-management/owners-management.component';
import { ShiftsManagementComponent } from './components/shifts-management/shifts-management.component';
import { AlertsManagementComponent } from './components/alerts-management/alerts-management.component';

type AdminView =
  | 'overview'
  | 'vehicles'
  | 'drivers'
  | 'owners'
  | 'shifts'
  | 'alerts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,
     AdminOverviewComponent, 
     VehiclesManagementComponent,
     DriversManagementComponent,
     OwnersManagementComponent,
     ShiftsManagementComponent,
     AlertsManagementComponent
    ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  currentView: AdminView = 'overview';

  sidebarOpen = false;

  user = {
    name: 'Administrador'
  };

  menuItems: { id: AdminView; label: string }[] = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'vehicles', label: 'Vehículos' },
    { id: 'drivers', label: 'Conductores' },
    { id: 'owners', label: 'Propietarios' },
    { id: 'shifts', label: 'Relevos' },
    { id: 'alerts', label: 'Alertas' }
  ];

  setView(view: AdminView) {
    this.currentView = view;
    this.sidebarOpen = false;
  }

  logout() {
    console.log('Cerrar sesión');
  }

}