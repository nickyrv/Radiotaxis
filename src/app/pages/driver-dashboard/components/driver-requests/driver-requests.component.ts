import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

import {
  RequestService,
  RequestItem
} from '../../../../services/request.service';

@Component({
  selector: 'app-driver-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './driver-requests.component.html',
  styleUrls: ['./driver-requests.component.css']
})
export class DriverRequestsComponent implements OnChanges {

  @Input() driverInfo: any = null;
  @Input() vehicle: any = null;

  requests: RequestItem[] = [];
  isLoading = false;

  constructor(private requestService: RequestService) {}

  ngOnChanges() {
    if (this.driverInfo?.id) {
      this.loadRequests();
    }
  }

  loadRequests() {
    this.isLoading = true;

    this.requestService.getDriverRequests(
      Number(this.driverInfo.id)
    ).subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes del conductor:', error);
        this.isLoading = false;
      }
    });
  }

  getRequestTypeLabel(type: string): string {
    switch (type) {
      case 'update_driver_profile':
        return 'Actualización de datos';
      case 'change_vehicle':
        return 'Cambio de vehículo';
      case 'temporary_leave':
        return 'Baja temporal';
      case 'definitive_leave':
        return 'Baja definitiva';
      case 'vehicle_failure':
        return 'Reporte de falla';
      case 'part_purchase_request':
        return 'Compra de repuesto';
      default:
        return type;
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'approved':
        return 'Aprobada';
      case 'rejected':
        return 'Rechazada';
      default:
        return status;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}