import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  RequestService,
  RequestCreate
} from '../../../../services/request.service';

@Component({
  selector: 'app-owner-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-profile.component.html',
  styleUrls: ['./owner-profile.component.css']
})
export class OwnerProfileComponent implements OnChanges {

  @Input() currentOwner: any = null;

  showEditForm = false;
  isSending = false;

  profileForm = {
    name: '',
    ci: '',
    phone: '',
    email: '',
    address: ''
  };

  constructor(private requestService: RequestService) {}

  ngOnChanges() {
    if (this.currentOwner) {
      this.profileForm = {
        name: this.currentOwner.name || '',
        ci: this.currentOwner.ci || '',
        phone: this.currentOwner.phone || '',
        email: this.currentOwner.email || '',
        address: this.currentOwner.address || ''
      };
    }
  }

  openEditForm() {
    this.showEditForm = true;
  }

  closeEditForm() {
    this.showEditForm = false;
  }

  sendProfileUpdateRequest() {
    if (!this.currentOwner) {
      alert('No se encontró información del propietario');
      return;
    }

    this.isSending = true;

    const request: RequestCreate = {
      requester_role: 'owner',
      requester_id: Number(this.currentOwner.id),

      owner_id: Number(this.currentOwner.id),
      driver_id: null,
      vehicle_id: null,

      request_type: 'update_profile',
      request_status: 'pending',

      reason: 'Solicitud de actualización de datos personales',
      details: JSON.stringify(this.profileForm),
      admin_response: null
    };

    this.requestService.createRequest(request).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente al administrador');
        this.isSending = false;
        this.showEditForm = false;
      },
      error: (error) => {
        console.error('Error al enviar solicitud:', error);
        alert('No se pudo enviar la solicitud');
        this.isSending = false;
      }
    });
  }
}