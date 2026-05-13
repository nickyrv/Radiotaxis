import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { mockVehicles, mockOwners } from '../../../../data/mock-data';

import { Vehicle } from '../../../../models/vehicle.model';

@Component({
  selector: 'app-vehicles-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-management.component.html',
  styleUrls: ['./vehicles-management.component.css']
})
export class VehiclesManagementComponent {

  vehicles = [...mockVehicles];

  showForm = false;

  editingVehicle: Vehicle | null = null;

  searchTerm = '';

  get filteredVehicles() {
    return this.vehicles.filter(vehicle =>
      vehicle.plate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getOwnerName(ownerId: string): string {
    return (
      mockOwners.find(owner => owner.id === ownerId)?.name ||
      'Desconocido'
    );
  }

  handleEdit(vehicle: Vehicle) {
    this.editingVehicle = vehicle;
    this.showForm = true;
  }

  handleDelete(id: string) {
    const confirmDelete = confirm(
      '¿Está seguro de eliminar este vehículo?'
    );

    if (confirmDelete) {
      this.vehicles = this.vehicles.filter(v => v.id !== id);
    }
  }

  getStatusColor(status: string): string {

    switch (status) {

      case 'active':
        return 'bg-green-100 text-green-700';

      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';

      case 'inactive':
        return 'bg-gray-100 text-gray-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'active':
        return 'Activo';

      case 'maintenance':
        return 'Mantenimiento';

      case 'inactive':
        return 'Inactivo';

      default:
        return status;
    }
  }

  openNewVehicleForm() {
    this.editingVehicle = null;
    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
  }
}