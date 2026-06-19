import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { PaymentService, Payment } from '../../services/payment.service';
import { ShiftService, Shift } from '../../services/shift.service';
import { VehicleService, Vehicle } from '../../services/vehicle.service';
import { DriverService, Driver } from '../../services/driver.service';
import { VehicleHistoryService, VehicleHistory } from '../../services/vehicle-history.service';

import { DriverOverviewComponent } from './components/driver-overview/driver-overview.component';
import { DriverProfileComponent } from './components/driver-profile/driver-profile.component';
import { DriverVehicleComponent } from './components/driver-vehicle/driver-vehicle.component';
import { DriverPaymentsComponent } from './components/driver-payments/driver-payments.component';
import { DriverFailuresComponent } from './components/driver-failures/driver-failures.component';
import { DriverRequestsComponent } from './components/driver-requests/driver-requests.component';

type DriverView =
  | 'overview'
  | 'profile'
  | 'vehicle'
  | 'payments'
  | 'failures'
  | 'requests';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DriverOverviewComponent,
    DriverProfileComponent,
    DriverVehicleComponent,
    DriverPaymentsComponent,
    DriverFailuresComponent,
    DriverRequestsComponent
  ],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  sidebarOpen = false;
  currentView: DriverView = 'overview';

  user: any = null;

  driverInfo: Driver | null = null;
  vehicle: Vehicle | null = null;

  driverPayments: Payment[] = [];
  driverShifts: Shift[] = [];
  driverIncidents: VehicleHistory[] = [];

  menuItems: { id: DriverView; label: string; icon: string }[] = [
    { id: 'overview', label: 'Resumen', icon: '🏠' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
    { id: 'vehicle', label: 'Mi Vehículo', icon: '🚕' },
    { id: 'payments', label: 'Pagos / Deudas', icon: '💰' },
    { id: 'failures', label: 'Fallas', icon: '🔧' },
    { id: 'requests', label: 'Solicitudes', icon: '📄' }
  ];

  constructor(
    private paymentService: PaymentService,
    private shiftService: ShiftService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private vehicleHistoryService: VehicleHistoryService,
    private router: Router
  ) {}

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');

    if (!savedUser) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.user = JSON.parse(savedUser);

    this.loadDriverData();
  }

  setView(view: DriverView) {
    this.currentView = view;
    this.sidebarOpen = false;
  }

  loadDriverData() {
    this.driverService.getDrivers().subscribe({
      next: (drivers: Driver[]) => {
        this.driverInfo =
          drivers.find(driver =>
            Number(driver.id) === Number(this.user.related_id)
          ) ||
          drivers.find(driver =>
            driver.email &&
            this.user.email &&
            driver.email.toLowerCase() === this.user.email.toLowerCase()
          ) ||
          null;

        if (!this.driverInfo) {
          alert('No se encontró un conductor relacionado a este usuario');
          return;
        }

        this.loadVehicle();
        this.loadPayments();
        this.loadShifts();
        this.loadVehicleHistory();
      },
      error: (error) => {
        console.error('Error al cargar conductor:', error);
      }
    });
  }

  loadVehicle() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicle =
          vehicles.find(vehicle =>
            Number(vehicle.id) === Number(this.driverInfo?.vehicle_id)
          ) ||
          vehicles.find(vehicle =>
            Number(vehicle.current_driver_id) === Number(this.driverInfo?.id)
          ) ||
          null;
      },
      error: (error) => {
        console.error('Error al cargar vehículo:', error);
      }
    });
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (payments: Payment[]) => {
        this.driverPayments = payments.filter(payment =>
          Number(payment.driver_id) === Number(this.driverInfo?.id)
        );
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  loadShifts() {
    this.shiftService.getShifts().subscribe({
      next: (shifts: Shift[]) => {
        this.driverShifts = shifts.filter(shift =>
          Number(shift.driver_id) === Number(this.driverInfo?.id)
        );
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
      }
    });
  }

  loadVehicleHistory() {
    if (!this.driverInfo?.id) {
      return;
    }

    this.vehicleHistoryService.getAllHistory().subscribe({
      next: (history: VehicleHistory[]) => {
        this.driverIncidents = history.filter(item =>
          Number(item.driver_id) === Number(this.driverInfo?.id)
        );
      },
      error: (error) => {
        console.error('Error al cargar reportes:', error);
      }
    });
  }

  get totalPayments() {
    return this.driverPayments
      .filter(payment => payment.status === 'paid')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  get pendingPayments() {
    return this.driverPayments.filter(payment =>
      payment.status === 'pending'
    );
  }

  get pendingDebt() {
    return this.pendingPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
  }

  get nextShift() {
    return this.driverShifts.find(shift =>
      shift.status === 'scheduled'
    );
  }

  formatDate(date: string | null) {
    if (!date) {
      return 'Sin fecha';
    }

    return new Date(date).toLocaleDateString('es-ES');
  }

  formatDateTime(date: string | null) {
    if (!date) {
      return 'Sin fecha';
    }

    return new Date(date).toLocaleString('es-ES');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}