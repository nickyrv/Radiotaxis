import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestCreate
} from '../../../../services/request.service';

@Component({
  selector: 'app-driver-failures',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-failures.component.html',
  styleUrls: ['./driver-failures.component.css']
})
export class DriverFailuresComponent {

  @Input() driverInfo: any = null;
  @Input() vehicle: any = null;
  @Input() driverIncidents: any[] = [];

  showFailureModal = false;
  isSending = false;

  failureForm = {
    type: 'failure',
    description: '',
    part_name: '',
    estimated_cost: null as number | null,
    reason: ''
  };

  constructor(private requestService: RequestService) {}

  openFailureModal(type: 'failure' | 'accident' | 'other' | 'part_purchase') {
    this.failureForm = {
      type,
      description: '',
      part_name: '',
      estimated_cost: null,
      reason: ''
    };

    this.showFailureModal = true;
  }

  closeFailureModal() {
    this.showFailureModal = false;
  }

  sendFailureRequest() {
    if (!this.driverInfo?.id) {
      alert('No se encontró información del conductor');
      return;
    }

    if (!this.failureForm.description) {
      alert('Debe ingresar una descripción');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'driver',
      requester_id: Number(this.driverInfo.id),

      owner_id: null,
      driver_id: Number(this.driverInfo.id),
      vehicle_id: this.vehicle?.id ? Number(this.vehicle.id) : null,

      request_type: this.failureForm.type === 'part_purchase'
        ? 'part_purchase_request'
        : 'vehicle_failure',
      request_status: 'pending',

      reason: this.failureForm.reason || this.failureForm.description,
      details: JSON.stringify({
        driver_name: this.driverInfo.name,
        vehicle: this.vehicle
          ? `${this.vehicle.plate} - ${this.vehicle.model}`
          : 'Sin vehículo asignado',
        report_type: this.failureForm.type,
        description: this.failureForm.description,
        part_name: this.failureForm.part_name,
        estimated_cost: this.failureForm.estimated_cost
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Reporte enviado correctamente a administración');
        this.isSending = false;
        this.closeFailureModal();
      },
      error: (error) => {
        console.error('Error al enviar reporte:', error);
        alert('No se pudo enviar el reporte');
        this.isSending = false;
      }
    });
  }

  getFailureTypeLabel(type: string): string {
    switch (type) {
      case 'failure':
        return 'Falla mecánica';
      case 'accident':
        return 'Accidente';
      case 'other':
        return 'Otro problema';
      case 'part_purchase':
        return 'Compra de repuesto';
      default:
        return type;
    }
  }
}