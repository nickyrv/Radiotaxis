import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import {
  VehicleService,
  Vehicle
} from '../../services/vehicle.service';

import {
  OwnerService,
  Owner
} from '../../services/owner.service';

import {
  PaymentService,
  Payment
} from '../../services/payment.service';

import {
  VehicleHistoryService,
  VehicleHistory
} from '../../services/vehicle-history.service';

import { OwnerOverviewComponent } from './components/owner-overview/owner-overview.component';
import { OwnerProfileComponent } from './components/owner-profile/owner-profile.component';
import { OwnerVehiclesComponent } from './components/owner-vehicles/owner-vehicles.component';
import { OwnerRequestsComponent } from './components/owner-requests/owner-requests.component';
import { OwnerReportsComponent } from './components/owner-reports/owner-reports.component';

type OwnerView =
  | 'overview'
  | 'profile'
  | 'vehicles'
  | 'requests'
  | 'reports';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    OwnerOverviewComponent,
    OwnerProfileComponent,
    OwnerVehiclesComponent,
    OwnerRequestsComponent,
    OwnerReportsComponent
  ],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {

  sidebarOpen = false;

  currentView: OwnerView = 'overview';

  user: any = null;

  ownerId: number | null = null;

  owners: Owner[] = [];
  currentOwner: Owner | null = null;

  vehicles: Vehicle[] = [];

  payments: Payment[] = [];

  vehicleHistory: VehicleHistory[] = [];

  menuItems: { id: OwnerView; label: string; icon: string }[] = [
    { id: 'overview', label: 'Resumen', icon: '🏠' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
    { id: 'vehicles', label: 'Mis Vehículos', icon: '🚕' },
    { id: 'requests', label: 'Solicitudes', icon: '📄' },
    { id: 'reports', label: 'Reportes', icon: '📊' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private paymentService: PaymentService,
    private vehicleHistoryService: VehicleHistoryService,
    private ownerService: OwnerService,
    private router: Router
  ) {}

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');

    if (!savedUser) {
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    this.user = JSON.parse(savedUser);

    this.loadOwnerAndData();
  }

  setView(view: OwnerView) {
    this.currentView = view;
    this.sidebarOpen = false;
  }

  loadOwnerAndData() {
    this.ownerService.getOwners().subscribe({
      next: (data) => {
        this.owners = data;

        this.currentOwner =
          this.owners.find(owner =>
            owner.email &&
            this.user.email &&
            owner.email.toLowerCase() === this.user.email.toLowerCase()
          ) || null;

        if (!this.currentOwner && this.user.related_id) {
          this.currentOwner =
            this.owners.find(owner =>
              Number(owner.id) === Number(this.user.related_id)
            ) || null;
        }

        if (!this.currentOwner) {
          alert('No se encontró un propietario relacionado a este usuario');
          return;
        }

        this.ownerId = Number(this.currentOwner.id);

        this.loadVehicles();
        this.loadPayments();
        this.loadVehicleHistory();
      },
      error: (error) => {
        console.error('Error al cargar propietario:', error);
      }
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data.filter(vehicle =>
          Number(vehicle.owner_id) === Number(this.ownerId)
        );
      },
      error: (error) => {
        console.error('Error al cargar vehículos del propietario:', error);
      }
    });
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  loadVehicleHistory() {
    this.vehicleHistoryService.getAllHistory().subscribe({
      next: (data) => {
        this.vehicleHistory = data;
      },
      error: (error) => {
        console.error('Error al cargar historial vehicular:', error);
      }
    });
  }

  get ownerVehicles() {
    return this.vehicles;
  }

  get ownerVehicleIds() {
    return this.ownerVehicles.map(vehicle => Number(vehicle.id));
  }

  get ownerPayments() {
    return this.payments.filter(payment =>
      payment.vehicle_id !== null &&
      this.ownerVehicleIds.includes(Number(payment.vehicle_id))
    );
  }

  get ownerMaintenances() {
    return this.vehicleHistory.filter(history =>
      history.vehicle_id !== null &&
      this.ownerVehicleIds.includes(Number(history.vehicle_id)) &&
      history.cost !== null &&
      history.cost !== undefined &&
      Number(history.cost) > 0
    );
  }

  get totalIncome() {
    return this.ownerPayments
      .filter(payment =>
        payment.type === 'income' &&
        payment.status === 'paid'
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  get totalExpenses() {
    return this.ownerPayments
      .filter(payment =>
        payment.type === 'expense' &&
        payment.status === 'paid'
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  get netProfit() {
    return this.totalIncome - this.totalExpenses;
  }

  getVehiclePlate(vehicleId: number | null): string {
    if (!vehicleId) {
      return 'N/A';
    }

    return (
      this.vehicles.find(vehicle =>
        Number(vehicle.id) === Number(vehicleId)
      )?.plate || 'N/A'
    );
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

}