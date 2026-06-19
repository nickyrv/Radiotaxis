import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestCreate
} from '../../../../services/request.service';

@Component({
  selector: 'app-driver-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.css']
})
export class DriverProfileComponent implements OnChanges {

  @Input() driverInfo: any = null;

  showProfileModal = false;
  isSending = false;
  selectedFileName = '';

  profileForm = {
    name: '',
    ci: '',
    ci_complement: '',
    phone: '',
    email: '',
    license: '',
    license_expiry: '',
    license_category: '',
    has_tic: false,
    address: '',
    reason: ''
  };

  constructor(private requestService: RequestService) {}

  ngOnChanges() {
    if (this.driverInfo) {
      this.profileForm = {
        name: this.driverInfo.name || '',
        ci: this.driverInfo.ci || '',
        ci_complement: this.driverInfo.ci_complement || '',
        phone: this.driverInfo.phone || '',
        email: this.driverInfo.email || '',
        license: this.driverInfo.license || '',
        license_expiry: this.driverInfo.license_expiry || '',
        license_category: this.driverInfo.license_category || '',
        has_tic: !!this.driverInfo.has_tic,
        address: this.driverInfo.address || '',
        reason: ''
      };
    }
  }

  openProfileModal() {
    this.selectedFileName = '';
    this.showProfileModal = true;
  }

  closeProfileModal() {
    this.showProfileModal = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];

    if (file) {
      this.selectedFileName = file.name;
    }
  }

  getLicenseStatusLabel(): string {
    if (!this.driverInfo?.license_expiry) {
      return 'Sin fecha registrada';
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(this.driverInfo.license_expiry + 'T00:00:00');
    expiry.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return 'Licencia vencida';
    }

    if (diffDays <= 30) {
      return `Por vencer en ${diffDays} días`;
    }

    return `Vigente (${diffDays} días restantes)`;
  }

  getLicenseStatusColor(): string {
    if (!this.driverInfo?.license_expiry) {
      return 'bg-gray-100 text-gray-700';
    }

    const today = new Date();
    const expiry = new Date(this.driverInfo.license_expiry + 'T00:00:00');

    const diffDays = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return 'bg-red-100 text-red-700';
    }

    if (diffDays <= 30) {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-green-100 text-green-700';
  }

  sendProfileUpdateRequest() {
    if (!this.driverInfo?.id) {
      alert('No se encontró información del conductor');
      return;
    }

    if (!this.profileForm.reason) {
      alert('Debe ingresar el motivo de la solicitud');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'driver',
      requester_id: Number(this.driverInfo.id),

      owner_id: null,
      driver_id: Number(this.driverInfo.id),
      vehicle_id: Number(this.driverInfo.vehicle_id) || null,

      request_type: 'update_driver_profile',
      request_status: 'pending',

      reason: this.profileForm.reason,
      details: JSON.stringify({
        driver_name: this.driverInfo.name,

        current_data: {
          name: this.driverInfo.name,
          ci: this.driverInfo.ci,
          ci_complement: this.driverInfo.ci_complement,
          phone: this.driverInfo.phone,
          email: this.driverInfo.email,
          license: this.driverInfo.license,
          license_expiry: this.driverInfo.license_expiry,
          license_category: this.driverInfo.license_category,
          has_tic: this.driverInfo.has_tic,
          address: this.driverInfo.address
        },

        requested_data: {
          name: this.profileForm.name,
          ci: this.profileForm.ci,
          ci_complement: this.profileForm.ci_complement,
          phone: this.profileForm.phone,
          email: this.profileForm.email,
          license: this.profileForm.license,
          license_expiry: this.profileForm.license_expiry,
          license_category: this.profileForm.license_category,
          has_tic: this.profileForm.has_tic,
          address: this.profileForm.address
        },

        support_file: this.selectedFileName || 'Sin archivo adjunto'
      }),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud de actualización de datos enviada correctamente');
        this.isSending = false;
        this.closeProfileModal();
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }

}