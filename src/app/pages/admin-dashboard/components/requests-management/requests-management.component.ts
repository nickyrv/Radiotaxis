import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestItem
} from '../../../../services/request.service';

@Component({
  selector: 'app-requests-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests-management.component.html',
  styleUrls: ['./requests-management.component.css']
})
export class RequestsManagementComponent implements OnInit {

  requests: RequestItem[] = [];
  isLoading = false;

  selectedRequest: RequestItem | null = null;
  showDetailModal = false;
  showResponseModal = false;

  responseAction: 'approved' | 'rejected' = 'approved';
  adminResponse = '';

  constructor(private requestService: RequestService) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.isLoading = true;

    this.requestService.getRequests().subscribe({
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

  openDetail(request: RequestItem) {
    this.selectedRequest = request;
    this.showDetailModal = true;
  }

  closeDetail() {
    this.showDetailModal = false;
    this.selectedRequest = null;
  }

  openResponseModal(
    request: RequestItem,
    action: 'approved' | 'rejected'
  ) {
    this.selectedRequest = request;
    this.responseAction = action;
    this.adminResponse = '';
    this.showResponseModal = true;
  }

  closeResponseModal() {
    this.showResponseModal = false;
    this.selectedRequest = null;
    this.adminResponse = '';
  }

  sendResponse() {
    if (!this.selectedRequest) {
      return;
    }

    if (!this.adminResponse) {
      alert('Debe ingresar una respuesta para la solicitud');
      return;
    }

    this.requestService.updateRequest(
      this.selectedRequest.id,
      {
        request_status: this.responseAction,
        admin_response: this.adminResponse
      }
    ).subscribe({
      next: () => {
        alert('Solicitud actualizada correctamente');
        this.closeResponseModal();
        this.loadRequests();
      },
      error: (error) => {
        console.error('Error al actualizar solicitud:', error);
        alert('No se pudo actualizar la solicitud');
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

  getRequesterLabel(request: RequestItem): string {
    if (request.requester_role === 'owner') {
      return `Propietario #${request.owner_id || request.requester_id}`;
    }

    if (request.requester_role === 'driver') {
      return `Conductor #${request.driver_id || request.requester_id}`;
    }

    return request.requester_role;
  }

  formatDetails(details: string | null): string {
    if (!details) {
      return 'Sin detalles';
    }

    try {
      const parsed = JSON.parse(details);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return details;
    }
  }
}