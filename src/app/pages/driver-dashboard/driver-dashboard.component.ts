import { Component } from '@angular/core';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css']
})
export class DriverDashboardComponent {
  pendingShifts = 3; // número de turnos pendientes de ejemplo
  nextShift = { startDate: new Date(), endDate: new Date() }; // ejemplo básico
}
