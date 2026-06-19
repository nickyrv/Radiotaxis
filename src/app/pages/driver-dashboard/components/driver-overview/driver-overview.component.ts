import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-driver-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-overview.component.html',
  styleUrls: ['./driver-overview.component.css']
})
export class DriverOverviewComponent {

  @Input() driverInfo: any = null;
  @Input() vehicle: any = null;

  @Input() driverPayments: any[] = [];
  @Input() driverShifts: any[] = [];
  @Input() driverIncidents: any[] = [];

  @Input() totalPayments = 0;
  @Input() pendingDebt = 0;

  @Input() nextShift: any = null;

  get incidentsCount() {
    return this.driverIncidents.length;
  }

  get paymentsCount() {
    return this.driverPayments.length;
  }

  get licenseStatus() {

    if (!this.driverInfo?.license_expiry) {
      return {
        text: 'Sin fecha registrada',
        color: 'bg-gray-100 text-gray-700'
      };
    }

    const today = new Date();
    const expiry = new Date(this.driverInfo.license_expiry);

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        text: 'Licencia vencida',
        color: 'bg-red-100 text-red-700'
      };
    }

    if (diffDays <= 30) {
      return {
        text: `Vence en ${diffDays} días`,
        color: 'bg-yellow-100 text-yellow-700'
      };
    }

    return {
      text: 'Licencia vigente',
      color: 'bg-green-100 text-green-700'
    };
  }
}