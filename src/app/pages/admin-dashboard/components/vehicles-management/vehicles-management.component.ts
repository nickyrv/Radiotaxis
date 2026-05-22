import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { mockOwners } from '../../../../data/mock-data';
import {
  VehicleService,
  Vehicle,
  VehicleRequest
} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-vehicles-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-management.component.html',
  styleUrls: ['./vehicles-management.component.css']
})
export class VehiclesManagementComponent implements OnInit {

  vehicles: Vehicle[] = [];

  showForm = false;

  editingVehicle: Vehicle | null = null;

  searchTerm = '';

  vehicleForm: VehicleRequest = {
    plate: '',
    model: '',
    year: 2026,
    owner_id: null,
    status: 'active',
    last_maintenance: null,
    next_maintenance: null,
    document_expiry: null
  };

  constructor(private vehicleService: VehicleService) {}

  ngOnInit() {
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        console.log('Vehículos desde backend:', data);
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    });
  }

  get filteredVehicles() {
    return this.vehicles.filter(vehicle =>
      vehicle.plate.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getOwnerName(ownerId: number | null): string {

    if (!ownerId) {
      return 'Sin propietario';
    }

    return (
      mockOwners.find(owner => Number(owner.id) === ownerId)?.name ||
      'Desconocido'
    );
  }

  handleEdit(vehicle: Vehicle) {
    this.editingVehicle = vehicle;

    this.vehicleForm = {
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,
      owner_id: vehicle.owner_id,
      status: vehicle.status,
      last_maintenance: vehicle.last_maintenance,
      next_maintenance: vehicle.next_maintenance,
      document_expiry: vehicle.document_expiry
    };

    this.showForm = true;
  }

  handleDelete(id: number) {
    const confirmDelete = confirm(
      '¿Está seguro de eliminar este vehículo?'
    );

    if (!confirmDelete) {
      return;
    }

    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al eliminar vehículo:', error);
        alert('No se pudo eliminar el vehículo');
      }
    });
  }

  saveVehicle() {

  if (this.editingVehicle) {

    this.vehicleService.updateVehicle(
      this.editingVehicle.id,
      this.vehicleForm
    ).subscribe({
      next: () => {
        this.closeModal();
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al actualizar vehículo:', error);
        alert('No se pudo actualizar el vehículo');
      }
    });

  } else {

    this.vehicleService.createVehicle(this.vehicleForm).subscribe({
      next: () => {
        this.closeModal();
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al guardar vehículo:', error);
        alert('No se pudo guardar el vehículo');
      }
    });

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

    this.vehicleForm = {
      plate: '',
      model: '',
      year: 2026,
      owner_id: null,
      status: 'active',
      last_maintenance: null,
      next_maintenance: null,
      document_expiry: null
    };

    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
  }
}