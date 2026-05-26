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
  IncidentService,
  Incident,
  IncidentRequest
} from '../../services/incident.service';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent implements OnInit {

  showPaymentForm = false;
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
  driverIncidents: Incident[] = [];

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

  incidentForm: IncidentRequest = {
    driver_id: this.user.id,
    vehicle_id: this.user.vehicleId,
    type: 'failure',
    description: '',
    incident_date: '',
    status: 'pending'
  };

  constructor(
    private paymentService: PaymentService,
    private shiftService: ShiftService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private incidentService: IncidentService
  ) {}

  ngOnInit() {
    this.loadDriverData();
    this.loadPayments();
    this.loadShifts();
    this.loadVehicle();
    this.loadIncidents();
  }

  loadDriverData() {
    this.driverService.getDrivers().subscribe({
      next: (drivers) => {
        this.driverInfo =
          drivers.find(d => d.id === this.user.id) || null;
      }
    });
  }

  loadVehicle() {
    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicle =
          vehicles.find(v => v.id === this.user.vehicleId) || null;
      }
    });
  }

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (payments) => {
        this.driverPayments = payments.filter(
          p => p.driver_id === this.user.id
        );
      }
    });
  }

  loadShifts() {
    this.shiftService.getShifts().subscribe({
      next: (shifts) => {
        this.driverShifts = shifts.filter(
          s => s.driver_id === this.user.id
        );
      }
    });
  }

  loadIncidents() {
    this.incidentService.getIncidents().subscribe({
      next: (incidents) => {
        this.driverIncidents = incidents.filter(
          i => i.driver_id === this.user.id
        );
      },
      error: (error) => {
        console.error('Error al cargar incidentes:', error);
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
      error: (error) => {
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
      driver_id: this.user.id,
      vehicle_id: this.user.vehicleId,
      type: 'failure',
      description: '',
      incident_date: today,
      status: 'pending'
    };

    this.showIncidentForm = true;
  }

  saveIncident() {
    this.incidentForm.type = this.incidentType;

    this.incidentService.createIncident(this.incidentForm).subscribe({
      next: () => {
        this.showIncidentForm = false;
        this.loadIncidents();
      },
      error: (error) => {
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