import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ShiftService,
  Shift,
  ShiftRequest
} from '../../../../services/shift.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-shifts-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shifts-management.component.html',
  styleUrls: ['./shifts-management.component.css']
})
export class ShiftsManagementComponent implements OnInit {

  shifts: Shift[] = [];

  drivers: Driver[] = [];

  vehicles: Vehicle[] = [];

  showForm = false;

  searchTerm = '';

  editingShift: Shift | null = null;

shiftForm: ShiftRequest = {
  driver_id: null,
  vehicle_id: null,
  start_time: '',
  end_time: '',
  status: 'scheduled',
  turn_order: 1,
  is_active: 1
}

  constructor(
    private shiftService: ShiftService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadShifts();
    this.loadDrivers();
    this.loadVehicles();
  }

  loadShifts() {
    this.shiftService.getShifts().subscribe({
      next: (data) => {
        this.shifts = data;
      },
      error: (error) => {
        console.error('Error al cargar relevos:', error);
      }
    });
  }

  loadDrivers() {
    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error al cargar conductores:', error);
      }
    });
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    });
  }

  get filteredShifts() {
    return this.shifts;
  }

  getDriverName(driverId: number | null) {
    if (!driverId) {
      return 'Sin conductor';
    }

    return (
      this.drivers.find(d => d.id === driverId)?.name ||
      'Sin conductor'
    );
  }

  getVehiclePlate(vehicleId: number | null) {
    if (!vehicleId) {
      return 'Sin vehículo';
    }

    return (
      this.vehicles.find(v => v.id === vehicleId)?.plate ||
      'Sin vehículo'
    );
  }

  openNewShiftForm() {
    this.editingShift = null;

    this.shiftForm = {
      driver_id: null,
      vehicle_id: null,
      start_time: '',
      end_time: '',
      status: 'scheduled',
      turn_order: 1,
      is_active: 1
    };

    this.showForm = true;
  }

  handleEdit(shift: Shift) {
    this.editingShift = shift;

    this.shiftForm = {
      driver_id: shift.driver_id,
      vehicle_id: shift.vehicle_id,
      start_time: shift.start_time,
      end_time: shift.end_time,
      status: shift.status,
      turn_order: 1,
      is_active: 1
    };

    this.showForm = true;
  }

  saveShift() {
    if (this.editingShift) {
      this.shiftService.updateShift(
        this.editingShift.id,
        this.shiftForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadShifts();
        },
        error: (error) => {
          console.error('Error al actualizar relevo:', error);
        }
      });
    } else {
      this.shiftService.createShift(this.shiftForm).subscribe({
        next: () => {
          this.closeModal();
          this.loadShifts();
        },
        error: (error) => {
          console.error('Error al guardar relevo:', error);
        }
      });
    }
  }

  handleDelete(id: number) {
    const confirmed = confirm('¿Eliminar relevo?');

    if (!confirmed) {
      return;
    }

    this.shiftService.deleteShift(id).subscribe({
      next: () => {
        this.loadShifts();
      },
      error: (error) => {
        console.error('Error al eliminar relevo:', error);
      }
    });
  }

  closeModal() {
    this.showForm = false;
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