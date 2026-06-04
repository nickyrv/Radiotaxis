import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PaymentService,
  Payment,
  PaymentRequest
} from '../../services/payment.service';

import {
  ShiftService,
  Shift
} from '../../services/shift.service';

import {
  VehicleService,
  Vehicle
} from '../../services/vehicle.service';

import {
  DriverService,
  Driver
} from '../../services/driver.service';

import {
  VehicleHistoryService,
  VehicleHistory,
  VehicleHistoryRequest
} from '../../services/vehicle-history.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  showPaymentForm = false;

  // Se mantiene con nombres "incident" porque tu HTML todavía los usa
  showIncidentForm = false;

  paymentType: 'daily' | 'weekly' = 'daily';
  incidentType: 'failure' | 'accident' | 'other' = 'failure';

  user = {
    id: 5,
    name: 'Conductor',
    vehicleId: 3
  };

  driverInfo: Driver | null = null;
  vehicle: Vehicle | null = null;

  driverPayments: Payment[] = [];
  driverShifts: Shift[] = [];

  // Ahora los incidentes vienen desde vehicle_history
  driverIncidents: VehicleHistory[] = [];

  paymentForm: PaymentRequest = {
    driver_id: this.user.id,
    vehicle_id: this.user.vehicleId,
    trip_id: null,
    amount: 0,
    type: 'daily',
    concept: 'Entrega diaria',
    payment_date: '',
    status: 'paid',
    observations: ''
  };

  incidentForm: VehicleHistoryRequest = {
    vehicle_id: this.user.vehicleId,
    driver_id: this.user.id,
    category: 'Falla reportada',
    detail: '',
    event_date: '',
    cost: null,
    description: '',
    maintenance_status: 'pending'
  };

  constructor(
    private paymentService: PaymentService,
    private shiftService: ShiftService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private vehicleHistoryService: VehicleHistoryService
  ) {}

  ngOnInit() {
    this.loadDriverData();
    this.loadPayments();
    this.loadShifts();
    this.loadVehicle();
    this.loadVehicleHistory();
  }

  loadDriverData() {
    this.driverService.getDrivers().subscribe({
      next: (drivers: Driver[]) => {
        this.driverInfo =
          drivers.find(d => d.id === this.user.id) || null;
      },
      error: (error: any) => {
        console.error('Error al cargar conductor:', error);
      }
    });
  }

  loadVehicle() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles: Vehicle[]) => {
        this.vehicle =
          vehicles.find(v => v.id === this.user.vehicleId) || null;
      },
      error: (error: any) => {
        console.error('Error al cargar vehículo:', error);
      }
    });
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (payments: Payment[]) => {
        this.driverPayments = payments.filter(
          p => p.driver_id === this.user.id
        );
      },
      error: (error: any) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  loadShifts() {
    this.shiftService.getShifts().subscribe({
      next: (shifts: Shift[]) => {
        this.driverShifts = shifts.filter(
          s => s.driver_id === this.user.id
        );
      },
      error: (error: any) => {
        console.error('Error al cargar turnos:', error);
      }
    });
  }

  loadVehicleHistory() {
    this.vehicleHistoryService
      .getVehicleHistory(this.user.vehicleId)
      .subscribe({
        next: (history: VehicleHistory[]) => {
          this.driverIncidents = history.filter(
            item => item.driver_id === this.user.id
          );
        },
        error: (error: any) => {
          console.error('Error al cargar reportes:', error);
        }
      });
  }

  openPaymentForm() {
    const today = new Date().toISOString().split('T')[0];

    this.paymentType = 'daily';

    this.paymentForm = {
      driver_id: this.user.id,
      vehicle_id: this.user.vehicleId,
      trip_id: null,
      amount: 0,
      type: 'daily',
      concept: 'Entrega diaria',
      payment_date: today,
      status: 'paid',
      observations: ''
    };

    this.showPaymentForm = true;
  }

  savePayment() {
    this.paymentForm.type = this.paymentType;
    this.paymentForm.concept =
      this.paymentType === 'daily'
        ? 'Entrega diaria'
        : 'Entrega semanal';

    this.paymentService.createPayment(this.paymentForm).subscribe({
      next: () => {
        this.showPaymentForm = false;
        this.loadPayments();
      },
      error: (error: any) => {
        console.error('Error al registrar pago:', error);
        alert('No se pudo registrar el pago');
      }
    });
  }

  setPaymentType(type: 'daily' | 'weekly') {
    this.paymentType = type;
    this.paymentForm.type = type;
    this.paymentForm.concept =
      type === 'daily'
        ? 'Entrega diaria'
        : 'Entrega semanal';
  }

  openIncidentForm() {
    const today = new Date().toISOString().split('T')[0];

    this.incidentType = 'failure';

    this.incidentForm = {
      vehicle_id: this.user.vehicleId,
      driver_id: this.user.id,
      category: 'Falla reportada',
      detail: '',
      event_date: today,
      cost: null,
      description: '',
      maintenance_status: 'pending'
    };

    this.showIncidentForm = true;
  }

  saveIncident() {
    if (!this.incidentForm.description) {
      alert('Debe ingresar una descripción');
      return;
    }

    if (!this.incidentForm.event_date) {
      alert('Debe seleccionar una fecha');
      return;
    }

    if (this.incidentType === 'failure') {
      this.incidentForm.category = 'Falla reportada';
      this.incidentForm.detail = 'Falla reportada por conductor';
    }

    if (this.incidentType === 'accident') {
      this.incidentForm.category = 'Accidente';
      this.incidentForm.detail = 'Accidente reportado por conductor';
    }

    if (this.incidentType === 'other') {
      this.incidentForm.category = 'Otro reporte';
      this.incidentForm.detail = 'Reporte del conductor';
    }

    this.incidentForm.cost = null;

    this.vehicleHistoryService.createHistory(this.incidentForm).subscribe({
      next: () => {
        this.showIncidentForm = false;
        this.loadVehicleHistory();
      },
      error: (error: any) => {
        console.error('Error al reportar incidente:', error);
        alert('No se pudo reportar el incidente');
      }
    });
  }

  get totalThisWeek() {
    return this.driverPayments.reduce(
      (sum, p) => sum + Number(p.amount),
      0
    );
  }

  get nextShift() {
    return this.driverShifts.find(
      s => s.status === 'scheduled'
    );
  }

  get scheduledShiftsCount() {
    return this.driverShifts.filter(
      s => s.status === 'scheduled'
    ).length;
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES');
  }

  formatDateTime(date: string) {
    return new Date(date).toLocaleString('es-ES');
  }

}