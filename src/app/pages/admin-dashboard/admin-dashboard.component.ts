import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, 
  LayoutDashboard, Car, Users, UserCircle, Calendar,
  AlertTriangle, LogOut, Menu, X 
} from 'lucide-angular';

// IMPORTA TUS COMPONENTES
import { AdminOverviewComponent } from '../admin/admin-overview/admin-overview.component';
import { VehiclesManagementComponent } from '../admin/vehicles-management/vehicles-management.component';
import { DriversManagementComponent } from '../admin/drivers-management/drivers-management.component';
import { OwnersManagementComponent } from '../admin/owners-management/owners-management.component';
import { ShiftsManagementComponent } from '../admin/shifts-management/shifts-management.component';
import { AlertsManagementComponent } from '../admin/alerts-management/alerts-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,

    // ICONOS DE LUCIDE
    LucideAngularModule.pick({
      LayoutDashboard,
      Car,
      Users,
      UserCircle,
      Calendar,
      AlertTriangle,
      LogOut,
      Menu,
      X
    }),

    // COMPONENTES DE LAS VISTAS
    AdminOverviewComponent,
    VehiclesManagementComponent,
    DriversManagementComponent,
    OwnersManagementComponent,
    ShiftsManagementComponent,
    AlertsManagementComponent
  ],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent {

  sidebarOpen = false;
  currentView: string = 'overview';

  menuItems = [
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'vehicles', label: 'Vehículos', icon: 'Car' },
    { id: 'drivers', label: 'Conductores', icon: 'Users' },
    { id: 'owners', label: 'Propietarios', icon: 'UserCircle' },
    { id: 'shifts', label: 'Relevos', icon: 'Calendar' },
    { id: 'alerts', label: 'Alertas', icon: 'AlertTriangle' }
  ];

  setView(view: string) {
    this.currentView = view;
    this.sidebarOpen = false;
  }

  logout() {
    console.log("CERRAR SESIÓN");
  }
}
