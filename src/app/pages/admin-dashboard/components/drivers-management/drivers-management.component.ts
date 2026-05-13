import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { mockDrivers, mockVehicles } from '../../../../data/mock-data';
import { Driver } from '../../../../models/driver';

@Component({
  selector: 'app-drivers-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers-management.component.html',
  styleUrls: ['./drivers-management.component.css']
})
export class DriversManagementComponent {
  
  mockVehicles = mockVehicles;
  
  drivers: Driver[] = [...mockDrivers];

  showForm = false;

  editingDriver: Driver | null = null;

  searchTerm = '';

  get filteredDrivers() {
    return this.drivers.filter(driver =>
      driver.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      driver.license.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getVehiclePlate(vehicleId: string): string {
    return (
      mockVehicles.find(vehicle => vehicle.id === vehicleId)?.plate ||
      'N/A'
    );
  }

  handleEdit(driver: Driver) {
    this.editingDriver = driver;
    this.showForm = true;
  }

  handleDelete(id: string) {
    const confirmed = confirm('¿Eliminar conductor?');

    if (confirmed) {
      this.drivers = this.drivers.filter(driver => driver.id !== id);
    }
  }

  handleToggleBlock(driver: Driver) {

    driver.status =
      driver.status === 'blocked'
        ? 'active'
        : 'blocked';
  }

  getStatusColor(status: string): string {

    switch (status) {

      case 'active':
        return 'bg-green-100 text-green-700';

      case 'blocked':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'active':
        return 'Activo';

      case 'blocked':
        return 'Bloqueado';

      default:
        return 'Inactivo';
    }
  }
}