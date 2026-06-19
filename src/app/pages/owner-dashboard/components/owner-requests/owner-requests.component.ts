import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

import {
  RequestService,
  RequestItem
} from '../../../../services/request.service';

@Component({
  selector: 'app-owner-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-requests.component.html',
  styleUrls: ['./owner-requests.component.css']
})
export class OwnerRequestsComponent implements OnChanges {

  @Input() currentOwner: any = null;
  @Input() ownerVehicles: any[] = [];

  requests: RequestItem[] = [];
  isLoading = false;

  constructor(private requestService: RequestService) {}

  ngOnChanges() {
    if (this.currentOwner?.id) {
      this.loadRequests();
    }
  }

  loadRequests() {
    this.isLoading = true;

    this.requestService.getOwnerRequests(
      Number(this.currentOwner.id)
    ).subscribe({
      next: (data) => {
        this.requests = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.isLoading = false;
      }
    });
  }

  getRequestTypeLabel(type: string): string {
    switch (type) {
      case 'update_profile':
        return 'Actualización de datos';
      case 'add_vehicle':
        return 'Nuevo vehículo';
      case 'deactivate_vehicle':
        return 'Baja de vehículo';
      case 'remove_driver':
        return 'Retiro de conductor';
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

  getVehiclePlate(vehicleId: number | null): string {
    if (!vehicleId) {
      return 'N/A';
    }

    return (
      this.ownerVehicles.find(vehicle =>
        Number(vehicle.id) === Number(vehicleId)
      )?.plate || 'N/A'
    );
  }
}