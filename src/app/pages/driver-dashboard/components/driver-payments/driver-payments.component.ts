import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-driver-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-payments.component.html',
  styleUrls: ['./driver-payments.component.css']
})
export class DriverPaymentsComponent {

  @Input() driverPayments: any[] = [];
  @Input() totalPayments = 0;
  @Input() pendingDebt = 0;

  get paidPayments() {
    return this.driverPayments.filter(payment =>
      payment.status === 'paid'
    );
  }

  get pendingPayments() {
    return this.driverPayments.filter(payment =>
      payment.status === 'pending'
    );
  }

  getStatusLabel(status: string): string {
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

  getStatusColor(status: string): string {
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
}