import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PaymentService,
  Payment,
  PaymentRequest
} from '../../../../services/payment.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

import {
  TripService,
  Trip
} from '../../../../services/trip.service';

@Component({
  selector: 'app-payments-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.css']
})
export class PaymentsManagementComponent implements OnInit {

  payments: Payment[] = [];

  drivers: Driver[] = [];

  vehicles: Vehicle[] = [];

  trips: Trip[] = [];

  showForm = false;

  editingPayment: Payment | null = null;

  searchTerm = '';

  paymentForm: PaymentRequest = {

    driver_id: null,

    vehicle_id: null,

    trip_id: null,

    amount: 0,

    type: 'daily',

    concept: '',

    payment_date: '',

    status: 'paid',

    observations: ''
  };

  constructor(
    private paymentService: PaymentService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private tripService: TripService
  ) {}

  ngOnInit() {

    this.loadPayments();

    this.loadDrivers();

    this.loadVehicles();

    this.loadTrips();
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

  loadDrivers() {

    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      }
    });
  }

  loadVehicles() {

    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      }
    });
  }

  loadTrips() {

    this.tripService.getTrips().subscribe({
      next: (data) => {
        this.trips = data;
      }
    });
  }

  get filteredPayments() {

    return this.payments.filter(payment =>

      payment.concept.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      )
    );
  }

  getDriverName(driverId: number | null): string {

    if (!driverId) {
      return 'N/A';
    }

    return (
      this.drivers.find(
        d => d.id === driverId
      )?.name || 'N/A'
    );
  }

  getVehiclePlate(vehicleId: number | null): string {

    if (!vehicleId) {
      return 'N/A';
    }

    return (
      this.vehicles.find(
        v => v.id === vehicleId
      )?.plate || 'N/A'
    );
  }

  openNewPaymentForm() {

    this.editingPayment = null;

    this.paymentForm = {

      driver_id: null,

      vehicle_id: null,

      trip_id: null,

      amount: 0,

      type: 'daily',

      concept: '',

      payment_date: '',

      status: 'paid',

      observations: ''
    };

    this.showForm = true;
  }

  handleEdit(payment: Payment) {

    this.editingPayment = payment;

    this.paymentForm = {

      driver_id: payment.driver_id,

      vehicle_id: payment.vehicle_id,

      trip_id: payment.trip_id,

      amount: payment.amount,

      type: payment.type,

      concept: payment.concept,

      payment_date: payment.payment_date,

      status: payment.status,

      observations: payment.observations
    };

    this.showForm = true;
  }

  savePayment() {

    if (this.editingPayment) {

      this.paymentService.updatePayment(
        this.editingPayment.id,
        this.paymentForm
      ).subscribe({
        next: () => {

          this.closeModal();

          this.loadPayments();
        },
        error: (error) => {
          console.error(
            'Error al actualizar pago:',
            error
          );
        }
      });

    } else {

      this.paymentService.createPayment(
        this.paymentForm
      ).subscribe({
        next: () => {

          this.closeModal();

          this.loadPayments();
        },
        error: (error) => {
          console.error(
            'Error al guardar pago:',
            error
          );
        }
      });

    }

  }

  handleDelete(id: number) {

    const confirmed = confirm(
      '¿Eliminar pago?'
    );

    if (!confirmed) {
      return;
    }

    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (error) => {
        console.error(
          'Error al eliminar pago:',
          error
        );
      }
    });
  }

  closeModal() {
    this.showForm = false;
  }

  getStatusColor(status: string) {

    switch (status) {

      case 'paid':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string) {

    switch (status) {

      case 'paid':
        return 'Pagado';

      case 'pending':
        return 'Pendiente';

      case 'cancelled':
        return 'Cancelado';

      default:
        return status;
    }
  }
}