import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  mockShifts,
  mockDrivers,
  mockVehicles
} from '../../../../data/mock-data';

import { Shift } from '../../../../models/shifts';

@Component({
  selector: 'app-shifts-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts-management.component.html',
  styleUrls: ['./shifts-management.component.css']
})
export class ShiftsManagementComponent {

  shifts: any[] = mockShifts;

  mockDrivers = mockDrivers;

  mockVehicles = mockVehicles;

  showForm = false;

  searchTerm = '';

  editingShift: Shift | null = null;

  get filteredShifts() {
    return this.shifts;
  }

  getDriverName(driverId: string) {
    return this.mockDrivers.find(
      d => d.id === driverId
    )?.name || 'Sin conductor';
  }

  getVehiclePlate(vehicleId: string) {
    return this.mockVehicles.find(
      v => v.id === vehicleId
    )?.plate || 'Sin vehículo';
  }

  handleEdit(shift: Shift) {
    this.editingShift = shift;
    this.showForm = true;
  }

  handleDelete(id: string) {
    this.shifts = this.shifts.filter(
      s => s.id !== id
    );
  }
getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-700';
    case 'scheduled':
      return 'bg-blue-100 text-blue-700';
    case 'completed':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

getStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'En curso';
    case 'scheduled':
      return 'Programado';
    case 'completed':
      return 'Completado';
    default:
      return status;
  }
}

formatDateTime(dateStr: string) {
  const date = new Date(dateStr);

  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
}

