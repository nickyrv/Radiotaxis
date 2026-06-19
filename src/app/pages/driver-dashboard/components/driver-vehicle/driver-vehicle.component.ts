import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestCreate
} from '../../../../services/request.service';

@Component({
  selector: 'app-driver-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-vehicle.component.html',
  styleUrls: ['./driver-vehicle.component.css']
})
export class DriverVehicleComponent {

  @Input() driverInfo: any = null;
  @Input() vehicle: any = null;

  showChangeVehicleModal = false;
  showLeaveModal = false;

  leaveType: 'temporary' | 'definitive' = 'temporary';
  isSending = false;

  changeVehicleForm = {
    reason: ''
  };

  leaveForm = {
    start_date: '',
    end_date: '',
    reason: ''
  };

  constructor(private requestService: RequestService) {}

  openChangeVehicleModal() {
    this.changeVehicleForm = { reason: '' };
    this.showChangeVehicleModal = true;
  }

  closeChangeVehicleModal() {
    this.showChangeVehicleModal = false;
  }

  openLeaveModal(type: 'temporary' | 'definitive') {
    this.leaveType = type;
    this.leaveForm = {
      start_date: '',
      end_date: '',
      reason: ''
    };
    this.showLeaveModal = true;
  }

  closeLeaveModal() {
    this.showLeaveModal = false;
  }

  sendChangeVehicleRequest() {
    if (!this.driverInfo?.id) {
      alert('No se encontró información del conductor');
      return;
    }

    if (!this.changeVehicleForm.reason) {
      alert('Debe ingresar el motivo del cambio de vehículo');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'driver',
      requester_id: Number(this.driverInfo.id),

      owner_id: null,
      driver_id: Number(this.driverInfo.id),
      vehicle_id: this.vehicle?.id ? Number(this.vehicle.id) : null,

      request_type: 'change_vehicle',
      request_status: 'pending',

      reason: this.changeVehicleForm.reason,
      details: JSON.stringify({
        driver_name: this.driverInfo.name,
        current_vehicle: this.vehicle
          ? `${this.vehicle.plate} - ${this.vehicle.model}`
          : 'Sin vehículo asignado',
        current_vehicle_id: this.vehicle?.id || null
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud de cambio de vehículo enviada correctamente');
        this.isSending = false;
        this.closeChangeVehicleModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }

  sendLeaveRequest() {
    if (!this.driverInfo?.id) {
      alert('No se encontró información del conductor');
      return;
    }

    if (!this.leaveForm.reason) {
      alert('Debe ingresar el motivo de la solicitud');
      return;
    }

    if (
      this.leaveType === 'temporary' &&
      (!this.leaveForm.start_date || !this.leaveForm.end_date)
    ) {
      alert('Debe seleccionar rango de fechas para baja temporal');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'driver',
      requester_id: Number(this.driverInfo.id),

      owner_id: null,
      driver_id: Number(this.driverInfo.id),
      vehicle_id: this.vehicle?.id ? Number(this.vehicle.id) : null,

      request_type: this.leaveType === 'temporary'
        ? 'temporary_leave'
        : 'definitive_leave',
      request_status: 'pending',

      deactivation_type: this.leaveType,
      start_date: this.leaveType === 'temporary'
        ? this.leaveForm.start_date
        : null,
      end_date: this.leaveType === 'temporary'
        ? this.leaveForm.end_date
        : null,

      reason: this.leaveForm.reason,
      details: JSON.stringify({
        driver_name: this.driverInfo.name,
        current_vehicle: this.vehicle
          ? `${this.vehicle.plate} - ${this.vehicle.model}`
          : 'Sin vehículo asignado',
        leave_type: this.leaveType,
        start_date: this.leaveForm.start_date,
        end_date: this.leaveForm.end_date
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente');
        this.isSending = false;
        this.closeLeaveModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }
}