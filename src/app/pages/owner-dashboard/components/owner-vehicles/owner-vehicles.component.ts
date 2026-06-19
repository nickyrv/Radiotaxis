import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestCreate
} from '../../../../services/request.service';

@Component({
  selector: 'app-owner-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-vehicles.component.html',
  styleUrls: ['./owner-vehicles.component.css']
})
export class OwnerVehiclesComponent {

  @Input() ownerVehicles: any[] = [];

  showDeactivateModal = false;
  showAddVehicleModal = false;
  showRemoveDriverModal = false;

  selectedVehicle: any = null;

  isSending = false;

  deactivateForm = {
    deactivation_type: 'temporary',
    start_date: '',
    end_date: '',
    reason: ''
  };

  addVehicleForm = {
    plate: '',
    model: '',
    year: new Date().getFullYear(),
    service_type: 'radio_taxi',
    color: '',
    reason: ''
  };

  removeDriverForm = {
    reason: ''
  };

  constructor(private requestService: RequestService) {}

  get currentOwnerId(): number | null {
    return this.ownerVehicles.length > 0
      ? Number(this.ownerVehicles[0].owner_id)
      : null;
  }

  openDeactivateModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.deactivateForm = {
      deactivation_type: 'temporary',
      start_date: '',
      end_date: '',
      reason: ''
    };
    this.showDeactivateModal = true;
  }

  closeDeactivateModal() {
    this.showDeactivateModal = false;
    this.selectedVehicle = null;
  }

  openAddVehicleModal() {
    this.addVehicleForm = {
      plate: '',
      model: '',
      year: new Date().getFullYear(),
      service_type: 'radio_taxi',
      color: '',
      reason: ''
    };
    this.showAddVehicleModal = true;
  }

  closeAddVehicleModal() {
    this.showAddVehicleModal = false;
  }

  openRemoveDriverModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.removeDriverForm = {
      reason: ''
    };
    this.showRemoveDriverModal = true;
  }

  closeRemoveDriverModal() {
    this.showRemoveDriverModal = false;
    this.selectedVehicle = null;
  }

  sendDeactivateRequest() {
    if (!this.selectedVehicle || !this.currentOwnerId) {
      alert('No se encontró vehículo o propietario');
      return;
    }

    if (!this.deactivateForm.reason) {
      alert('Debe ingresar el motivo de la baja');
      return;
    }

    if (
      this.deactivateForm.deactivation_type === 'temporary' &&
      (!this.deactivateForm.start_date || !this.deactivateForm.end_date)
    ) {
      alert('Debe seleccionar rango de fechas para baja temporal');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'owner',
      requester_id: this.currentOwnerId,

      owner_id: this.currentOwnerId,
      driver_id: null,
      vehicle_id: Number(this.selectedVehicle.id),

      request_type: 'deactivate_vehicle',
      request_status: 'pending',

      deactivation_type: this.deactivateForm.deactivation_type,
      start_date: this.deactivateForm.deactivation_type === 'temporary'
        ? this.deactivateForm.start_date
        : null,
      end_date: this.deactivateForm.deactivation_type === 'temporary'
        ? this.deactivateForm.end_date
        : null,

      reason: this.deactivateForm.reason,
      details: JSON.stringify({
        vehicle_plate: this.selectedVehicle.plate,
        vehicle_model: this.selectedVehicle.model,
        deactivation_type: this.deactivateForm.deactivation_type,
        start_date: this.deactivateForm.start_date,
        end_date: this.deactivateForm.end_date
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud de baja enviada correctamente');
        this.isSending = false;
        this.closeDeactivateModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }

  sendAddVehicleRequest() {
    if (!this.currentOwnerId) {
      alert('No se encontró propietario');
      return;
    }

    if (!this.addVehicleForm.plate || !this.addVehicleForm.model) {
      alert('Debe ingresar placa y modelo');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'owner',
      requester_id: this.currentOwnerId,

      owner_id: this.currentOwnerId,
      driver_id: null,
      vehicle_id: null,

      request_type: 'add_vehicle',
      request_status: 'pending',

      reason: this.addVehicleForm.reason || 'Solicitud de incorporación de nuevo vehículo',
      details: JSON.stringify(this.addVehicleForm),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud de nuevo vehículo enviada correctamente');
        this.isSending = false;
        this.closeAddVehicleModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }

  sendRemoveDriverRequest() {
    if (!this.selectedVehicle || !this.currentOwnerId) {
      alert('No se encontró vehículo o propietario');
      return;
    }

    if (!this.selectedVehicle.current_driver_id) {
      alert('Este vehículo no tiene conductor asignado');
      return;
    }

    if (!this.removeDriverForm.reason) {
      alert('Debe ingresar el motivo');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'owner',
      requester_id: this.currentOwnerId,

      owner_id: this.currentOwnerId,
      driver_id: Number(this.selectedVehicle.current_driver_id),
      vehicle_id: Number(this.selectedVehicle.id),

      request_type: 'remove_driver',
      request_status: 'pending',

      reason: this.removeDriverForm.reason,
      details: JSON.stringify({
        vehicle_plate: this.selectedVehicle.plate,
        vehicle_model: this.selectedVehicle.model,
        current_driver_id: this.selectedVehicle.current_driver_id
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud de retiro de conductor enviada correctamente');
        this.isSending = false;
        this.closeRemoveDriverModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }
}