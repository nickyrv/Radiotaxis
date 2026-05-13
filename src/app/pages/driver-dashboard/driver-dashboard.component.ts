import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  mockPayments,
  mockShifts,
  mockVehicles,
  mockIncidents,
  mockDrivers
} from '../../data/mock-data';
@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {

  showPaymentForm = false;

  showIncidentForm = false;

  paymentType: 'daily' | 'weekly' = 'daily';

  incidentType: 'failure' | 'accident' | 'other' = 'failure';

  user = {
    id: '1',
    name: 'Juan Pérez',
    vehicleId: '1'
  };

  driverInfo = mockDrivers.find(
    d => d.id === this.user.id
  );

  driverPayments = mockPayments.filter(
    p => p.driverId === this.user.id
  );

  driverShifts = mockShifts.filter(
    s => s.driverId === this.user.id
  );

  driverIncidents = mockIncidents.filter(
    i => i.driverId === this.user.id
  );

  vehicle = mockVehicles.find(
    v => v.id === this.user.vehicleId
  );

  totalThisWeek = this.driverPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  nextShift = this.driverShifts.find(
    s => s.status === 'scheduled'
  );

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('es-ES');
  }

  formatDateTime(date: string) {
    return new Date(date).toLocaleString('es-ES');
  }

}