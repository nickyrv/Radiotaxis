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

import {
  ShiftDayService,
  ShiftDay
} from '../../../../services/shift-day.service';

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
  shiftDays: ShiftDay[] = [];

  calendarStartDate = '';
  calendarDays = 7;

  showForm = false;

  searchTerm = '';

  editingShift: Shift | null = null;

  selectedVehicle: Vehicle | null = null;

  driverOneId: number | null = null;
  driverTwoId: number | null = null;
  selectedCalendarVehicle: Vehicle | null = null;
  editingDate: string | null = null;
  currentCalendarMonth = new Date().getMonth();

  currentCalendarYear = new Date().getFullYear();

shiftStartDate = '';

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
    private vehicleService: VehicleService,
    private shiftDayService: ShiftDayService
  ) {}

  ngOnInit() {
    this.loadShifts();
    this.loadDrivers();
    this.loadVehicles();
    this.loadShiftDays();
  }

  loadShiftDays() {
    this.shiftDayService.getShiftDays().subscribe({
      next: (data) => {
        this.shiftDays = data;
      },
      error: (error) => {
        console.error('Error al cargar calendario de relevos:', error);
      }
    });
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

  onVehicleSelected() {
    this.selectedVehicle =
      this.vehicles.find(
        vehicle => vehicle.id === this.shiftForm.vehicle_id
      ) || null;

    this.driverOneId = null;
    this.driverTwoId = null;
  }

  get availableDrivers() {
    return this.drivers.filter(driver =>
      driver.status === 'active'
    );
  }

  getTodayDriver(vehicle: Vehicle): string {
    const activeShifts = this.shifts
      .filter(shift =>
        Number(shift.vehicle_id) === Number(vehicle.id) &&
        Number(shift.is_active) === 1
      )
      .sort((a, b) => Number(a.turn_order) - Number(b.turn_order));

    if (activeShifts.length === 0) {
      return 'Sin conductor de turno';
    }

    if (vehicle.management_type === 'solo') {
      return this.getDriverName(activeShifts[0].driver_id);
    }

    const startDate = new Date(activeShifts[0].start_time);
    const today = new Date();

    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const index = Math.abs(diffDays) % activeShifts.length;

    return this.getDriverName(activeShifts[index].driver_id);
  }

  openNewShiftForm() {
    this.editingShift = null;

    this.shiftForm = {
      driver_id: null,
      vehicle_id: null,
      start_time: '',
      end_time: '',
      status: 'active',
      turn_order: 1,
      is_active: 1
    };

    this.selectedVehicle = null;
    this.driverOneId = null;
    this.driverTwoId = null;
    this.shiftStartDate = '';

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
    if (!this.shiftForm.vehicle_id) {
      alert('Debe seleccionar un vehículo');
      return;
    }

    if (!this.selectedVehicle) {
      alert('Debe seleccionar un vehículo válido');
      return;
    }

    if (!this.shiftStartDate) {
      alert('Debe seleccionar la fecha de inicio');
      return;
    }

    if (!this.driverOneId) {
      alert('Debe seleccionar el primer conductor');
      return;
    }

    if (
      this.selectedVehicle.management_type === 'relevos' &&
      !this.driverTwoId
    ) {
      alert('Debe seleccionar el segundo conductor para vehículos por relevos');
      return;
    }

    if (
      this.selectedVehicle.management_type === 'relevos' &&
      this.driverOneId === this.driverTwoId
    ) {
      alert('Los dos conductores no pueden ser el mismo');
      return;
    }

    const startTime = `${this.shiftStartDate}T00:00:00`;
    const endTime = '2099-12-31T23:59:59';

    const requests: ShiftRequest[] = [
      {
        driver_id: this.driverOneId,
        vehicle_id: this.shiftForm.vehicle_id,
        start_time: startTime,
        end_time: endTime,
        status: 'active',
        turn_order: 1,
        is_active: 1
      }
    ];

    if (this.selectedVehicle.management_type === 'relevos') {
      requests.push({
        driver_id: this.driverTwoId,
        vehicle_id: this.shiftForm.vehicle_id,
        start_time: startTime,
        end_time: endTime,
        status: 'active',
        turn_order: 2,
        is_active: 1
      });
    }

    let completed = 0;

    requests.forEach(request => {
      this.shiftService.createShift(request).subscribe({
        next: () => {
          completed++;

          if (completed === requests.length) {
            this.closeModal();
            this.loadShifts();
          }
        },
        error: (error) => {
          console.error('Error al guardar relevo:', error);
          alert('No se pudo guardar el relevo');
        }
      });
    });
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

  get vehiclesWithCurrentDrivers() {
    return this.vehicles.map(vehicle => {
      const activeShifts = this.shifts
        .filter(shift =>
          Number(shift.vehicle_id) === Number(vehicle.id) &&
          Number(shift.is_active) === 1
        )
        .sort((a, b) => Number(a.turn_order) - Number(b.turn_order));

      return {
        vehicle,
        activeShifts,
        currentDriver: this.getTodayDriver(vehicle)
      };
    });
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

  getCalendarDates(): string[] {
  const start =
    this.calendarStartDate ||
    new Date().toISOString().split('T')[0];

  const dates: string[] = [];
  const startDate = new Date(start);

  for (let i = 0; i < this.calendarDays; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;}

  getManualShiftDay(vehicleId: number, date: string): ShiftDay | null {
    return (
      this.shiftDays.find(day =>
        Number(day.vehicle_id) === Number(vehicleId) &&
        day.shift_date === date
      ) || null
    );
  }

  getAutomaticDriverForDate(vehicle: Vehicle, date: string): number | null {
    const activeShifts = this.shifts
      .filter(shift =>
        Number(shift.vehicle_id) === Number(vehicle.id) &&
        Number(shift.is_active) === 1
      )
      .sort((a, b) => Number(a.turn_order) - Number(b.turn_order));

    if (activeShifts.length === 0) {
      return null;
    }

    if (vehicle.management_type === 'solo') {
      return activeShifts[0].driver_id;
    }

    const startDate = new Date(activeShifts[0].start_time);
    const currentDate = new Date(date);

    startDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (currentDate.getTime() - startDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    const index = Math.abs(diffDays) % activeShifts.length;

    return activeShifts[index].driver_id;
  }

  getDriverForDate(vehicle: Vehicle, date: string): number | null {
    const manualDay = this.getManualShiftDay(vehicle.id, date);

    if (manualDay) {
      return manualDay.driver_id;
    }

    return this.getAutomaticDriverForDate(vehicle, date);
  }

  getShiftSource(vehicle: Vehicle, date: string): string {
    const manualDay = this.getManualShiftDay(vehicle.id, date);

    return manualDay ? manualDay.source : 'automatic';
  }

  changeDriverForDate(vehicle: Vehicle, date: string, driverId: number) {
    this.shiftDayService.createShiftDay({
      vehicle_id: vehicle.id,
      driver_id: Number(driverId),
      shift_date: date,
      source: 'manual',
      notes: 'Cambio manual desde calendario de relevos'
    }).subscribe({
      next: () => {
        this.loadShiftDays();
      },
      error: (error) => {
        console.error('Error al cambiar conductor del día:', error);
        alert('No se pudo cambiar el conductor del día');
      }
    });
  }

  openVehicleCalendar(vehicle: Vehicle) {
    this.selectedCalendarVehicle = vehicle;
  }

  backToVehicleGrid() {
    this.selectedCalendarVehicle = null;
    this.editingDate = null;
  }

  getCalendarTitle(): string {
    const date = new Date(
      this.currentCalendarYear,
      this.currentCalendarMonth,
      1
    );

    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  previousMonth() {
    if (this.currentCalendarMonth === 0) {
      this.currentCalendarMonth = 11;
      this.currentCalendarYear--;
    } else {
      this.currentCalendarMonth--;
    }
  }

  nextMonth() {
    if (this.currentCalendarMonth === 11) {
      this.currentCalendarMonth = 0;
      this.currentCalendarYear++;
    } else {
      this.currentCalendarMonth++;
    }
  }

  getMonthCalendarDays(): string[] {
    const days: string[] = [];

    const firstDay = new Date(
      this.currentCalendarYear,
      this.currentCalendarMonth,
      1
    );

    const lastDay = new Date(
      this.currentCalendarYear,
      this.currentCalendarMonth + 1,
      0
    );

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(
        this.currentCalendarYear,
        this.currentCalendarMonth,
        day
      );

      days.push(date.toISOString().split('T')[0]);
    }

    return days;
  }

  getDayNumber(date: string): number {
    return new Date(date).getDate();
  }

  startEditDate(date: string) {
    this.editingDate = date;
  }

  finishEditDate() {
    this.editingDate = null;
  }

  getShiftLabel(vehicle: Vehicle, date: string): string {
    const source = this.getShiftSource(vehicle, date);

    return source === 'manual'
      ? 'Reemplazo temporal'
      : 'Oficial';
  }

}