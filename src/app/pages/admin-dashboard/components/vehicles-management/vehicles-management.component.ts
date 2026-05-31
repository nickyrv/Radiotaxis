import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { mockOwners } from '../../../../data/mock-data';

import {
  VehicleService,
  Vehicle,
  VehicleRequest
} from '../../../../services/vehicle.service';

import {
  OwnerService,
  Owner
} from '../../../../services/owner.service';

import {
  VehicleHistoryService,
  VehicleHistory,
  VehicleHistoryRequest
} from '../../../../services/vehicle-history.service';

import {
  ShiftService,
  Shift
} from '../../../../services/shift.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

@Component({
  selector: 'app-vehicles-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicles-management.component.html',
  styleUrls: ['./vehicles-management.component.css']
})
export class VehiclesManagementComponent implements OnInit {

  vehicles: Vehicle[] = [];
  owners: Owner[] = [];
  shifts: Shift[] = [];
  drivers: Driver[] = [];

  showForm = false;
  showNewHistoryForm = false;

  editingVehicle: Vehicle | null = null;
  editingHistory: VehicleHistory | null = null;

  selectedVehicle: Vehicle | null = null;
  selectedPhotoFile: File | null = null;

  searchTerm = '';
  activeDetailTab = 'general';

  historySearchTerm = '';
  historyDriverFilter = '';
  historyDateFilter = '';

  vehicleHistory: VehicleHistory[] = [];

  maintenanceCategories = [
    'mantenimiento_general',
    'accidente',
    'liquido_frenos',
    'pastillas',
    'cambio_llantas',
    'disco_embrague_remache',
    'disco_embrague_kit',
    'pintura',
    'chaperio'
  ];

  vehicleForm: VehicleRequest = this.getEmptyVehicleForm();

  historyForm: VehicleHistoryRequest = this.getEmptyHistoryForm();

  constructor(
    private vehicleService: VehicleService,
    private vehicleHistoryService: VehicleHistoryService,
    private ownerService: OwnerService,
    private shiftService: ShiftService,
    private driverService: DriverService
  ) {}

  ngOnInit() {
    this.loadVehicles();
    this.loadOwners();
    this.loadShifts();
    this.loadDrivers();
  }

  getEmptyVehicleForm(): VehicleRequest {
    return {
      plate: '',
      model: '',
      year: 2026,

      owner_id: null,

      service_type: 'radio_taxi',
      radio_code: '',
      company_name: '',

      status: 'active',

      last_maintenance: null,
      next_maintenance: null,

      photo_url: '',
      color: '',
      restriction_day: '',

      registration_date: null,
      deactivation_date: null,

      management_status: 'active',
      management_type: 'solo',

      current_driver_id: null,
      admin_id: null
    };
  }

  getEmptyHistoryForm(): VehicleHistoryRequest {
    const today = new Date().toISOString().split('T')[0];

    return {
      vehicle_id: this.selectedVehicle?.id || 0,
      driver_id: null,
      category: 'mantenimiento_general',
      detail: '',
      event_date: today,
      cost: null,
      description: ''
    };
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;

        if (this.selectedVehicle) {
          const updatedVehicle = data.find(
            vehicle => vehicle.id === this.selectedVehicle?.id
          );

          this.selectedVehicle = updatedVehicle || null;
        }
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
      }
    });
  }
  loadShifts() {
    this.shiftService.getShifts().subscribe({
      next: (data) => {
        this.shifts = data;
      },
      error: (error) => {
        console.error('Error al cargar turnos:', error);
      }
    });
  }
    loadOwners() {
      this.ownerService.getOwners().subscribe({
        next: (data) => {
          this.owners = data;
        },
        error: (error) => {
          console.error('Error al cargar propietarios:', error);
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
  get filteredVehicles() {
    const term = this.searchTerm.toLowerCase();

    return this.vehicles.filter(vehicle =>
      vehicle.plate.toLowerCase().includes(term) ||
      vehicle.model.toLowerCase().includes(term) ||
      (vehicle.radio_code || '').toLowerCase().includes(term) ||
      (vehicle.color || '').toLowerCase().includes(term) ||
      this.getOwnerName(vehicle.owner_id).toLowerCase().includes(term)
    );
  }
  get accidentHistory() {
    return this.vehicleHistory.filter(history =>
      (history.category || '').toLowerCase().includes('accidente')
    );
  }
  get filteredVehicleHistory() {
    return this.vehicleHistory.filter(history => {
      const search = this.historySearchTerm.toLowerCase();

      const matchesSearch =
        (history.detail || '').toLowerCase().includes(search) ||
        (history.description || '').toLowerCase().includes(search) ||
        history.category.toLowerCase().includes(search);

      const matchesDriver =
        !this.historyDriverFilter ||
        String(history.driver_id || '') === this.historyDriverFilter;

      const matchesDate =
        !this.historyDateFilter ||
        history.event_date === this.historyDateFilter;

      if (this.activeDetailTab === 'accidentes') {
        return history.category === 'accidente' &&
          matchesSearch &&
          matchesDriver &&
          matchesDate;
      }

      if (this.activeDetailTab === 'mantenimiento') {
        return history.category !== 'accidente' &&
          matchesSearch &&
          matchesDriver &&
          matchesDate;
      }

      return matchesSearch && matchesDriver && matchesDate;
    });
  }

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.activeDetailTab = 'general';
    this.loadVehicleHistory(vehicle.id);
  }

  backToList() {
    this.selectedVehicle = null;
    this.vehicleHistory = [];
    this.activeDetailTab = 'general';
  }

  setDetailTab(tab: string) {
    this.activeDetailTab = tab;
  }

  loadVehicleHistory(vehicleId: number) {
    this.vehicleHistoryService.getVehicleHistory(vehicleId).subscribe({
      next: (data) => {
        this.vehicleHistory = data;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
      }
    });
  }

  openNewHistoryForm() {
    if (!this.selectedVehicle) return;

    this.editingHistory = null;
    this.historyForm = this.getEmptyHistoryForm();
    this.historyForm.vehicle_id = this.selectedVehicle.id;

    if (this.activeDetailTab === 'accidentes') {
      this.historyForm.category = 'accidente';
    }

    this.showNewHistoryForm = true;
  }

  editHistory(history: VehicleHistory) {
    this.editingHistory = history;

    this.historyForm = {
      vehicle_id: history.vehicle_id,
      driver_id: history.driver_id,
      category: history.category,
      detail: history.detail,
      event_date: history.event_date,
      cost: history.cost,
      description: history.description
    };

    this.showNewHistoryForm = true;
  }

  saveHistory() {
  if (!this.historyForm.category) {
    alert('Debe seleccionar una categoría');
    return;
  }

  if (!this.historyForm.event_date) {
    alert('Debe seleccionar una fecha');
    return;
  }

  if (!this.historyForm.detail) {
    alert('Debe ingresar el detalle del registro');
    return;
  }

  const isAccident =
  (this.historyForm.category || '').toLowerCase().includes('accidente');

if (isAccident) {
  this.assignDriverByAccidentDate();

  if (!this.historyForm.driver_id) {
    alert('No se encontró chofer de turno para la fecha del accidente');
    return;
  }

  this.historyForm.cost = null;
}

  if (!isAccident) {
    const historyCost = Number(this.historyForm.cost);

    if (
      this.historyForm.cost === null ||
      isNaN(historyCost) ||
      historyCost <= 0
    ) {
      alert('El costo debe ser mayor a 0 Bs.');
      return;
    }

    this.historyForm.cost = historyCost;

  } else {
    this.historyForm.cost = null;
  }

  if (this.editingHistory) {
    this.vehicleHistoryService.updateHistory(
      this.editingHistory.id,
      this.historyForm
    ).subscribe({
      next: () => {
        this.showNewHistoryForm = false;
        this.editingHistory = null;

        if (this.selectedVehicle) {
          this.loadVehicleHistory(this.selectedVehicle.id);
        }
      },
      error: (error) => {
        console.error('Error al actualizar historial:', error);
        alert('No se pudo actualizar el registro');
      }
    });

  } else {
    this.vehicleHistoryService.createHistory(this.historyForm).subscribe({
      next: () => {
        this.showNewHistoryForm = false;

        if (this.selectedVehicle) {
          this.loadVehicleHistory(this.selectedVehicle.id);
        }
      },
      error: (error) => {
        console.error('Error al guardar historial:', error);
        alert('No se pudo guardar el registro');
      }
    });
  }
}
  deleteHistory(id: number) {
    const confirmDelete = confirm('¿Eliminar este registro?');

    if (!confirmDelete) return;

    this.vehicleHistoryService.deleteHistory(id).subscribe({
      next: () => {
        if (this.selectedVehicle) {
          this.loadVehicleHistory(this.selectedVehicle.id);
        }
      },
      error: (error) => {
        console.error('Error al eliminar historial:', error);
        alert('No se pudo eliminar');
      }
    });
  }

  getOwnerName(ownerId: number | null): string {

    if (!ownerId) {
      return 'Sin propietario';
    }

    return (
      this.owners.find(owner => owner.id === ownerId)?.name ||
      'Desconocido'
    );
  }

  openNewVehicleForm() {

    this.editingVehicle = null;

    this.vehicleForm = this.getEmptyVehicleForm();

    this.selectedPhotoFile = null;

    this.showForm = true;

  }

  handleEdit(vehicle: Vehicle) {
    this.editingVehicle = vehicle;

    this.vehicleForm = {
      plate: vehicle.plate,
      model: vehicle.model,
      year: vehicle.year,

      owner_id: vehicle.owner_id && Number(vehicle.owner_id) > 0
      ? Number(vehicle.owner_id)
      : null,
      service_type: vehicle.service_type,
      radio_code: vehicle.radio_code,
      company_name: vehicle.company_name,

      status: vehicle.status,

      last_maintenance: vehicle.last_maintenance,
      next_maintenance: vehicle.next_maintenance,

      photo_url: vehicle.photo_url,
      color: vehicle.color,
      restriction_day: vehicle.restriction_day,

      registration_date: vehicle.registration_date,
      deactivation_date: vehicle.deactivation_date,

      management_status: vehicle.management_status,
      management_type: vehicle.management_type,

      current_driver_id: vehicle.current_driver_id,
      admin_id: vehicle.admin_id
    };

    this.selectedPhotoFile = null;
    this.showForm = true;
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedPhotoFile = null;
      return;
    }

    this.selectedPhotoFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.vehicleForm.photo_url = reader.result as string;
    };

    reader.readAsDataURL(this.selectedPhotoFile);
  }

  validateVehicleForm(): boolean {
    const plateRegex = /^\d{3,4}\s[A-Z]{3}$/;

    this.vehicleForm.plate = this.vehicleForm.plate.trim().toUpperCase();

    if (!plateRegex.test(this.vehicleForm.plate)) {
      alert('La placa debe tener el formato 123 ABC o 1234 ABC');
      return false;
    }

    if (!this.vehicleForm.model) {
      alert('Debe ingresar el modelo del vehículo');
      return false;
    }

    if (!this.vehicleForm.year) {
      alert('Debe ingresar el año del vehículo');
      return false;
    }

    const ownerId = Number(this.vehicleForm.owner_id);

    const ownerExists = this.owners.some(
      owner => Number(owner.id) === ownerId
    );

    if (!ownerId || isNaN(ownerId) || !ownerExists) {
      alert('Debe seleccionar un propietario registrado');
      return false;
    }

    this.vehicleForm.owner_id = ownerId;
    
      if (
      this.vehicleForm.service_type === 'radio_taxi' &&
      !this.vehicleForm.radio_code
    ) {
      alert('El código interno es obligatorio para radio taxi');
      return false;
    }

    if (
      this.vehicleForm.service_type === 'radio_taxi' &&
      !this.vehicleForm.company_name
    ) {
      alert('Debe ingresar la empresa de radio taxi');
      return false;
    }

    if (!this.vehicleForm.color) {
      alert('Debe ingresar el color del vehículo');
      return false;
    }

    if (!this.vehicleForm.restriction_day) {
      alert('Debe seleccionar el día de restricción de placa');
      return false;
    }

    if (!this.vehicleForm.status) {
      alert('Debe seleccionar el estado operativo');
      return false;
    }

    if (!this.vehicleForm.management_type) {
      alert('Debe seleccionar el tipo de administración');
      return false;
    }

    if (!this.vehicleForm.registration_date) {
      alert('Debe ingresar la fecha de registro');
      return false;
    }

    if (this.vehicleForm.service_type === 'taxi') {
      this.vehicleForm.radio_code = null;
    }

    return true;
  }

  saveVehicle() {
    if (!this.validateVehicleForm()) {
      return;
    }

    const payload: VehicleRequest = {
      ...this.vehicleForm,
      photo_url: this.selectedPhotoFile
        ? this.editingVehicle?.photo_url || null
        : this.vehicleForm.photo_url
    };

    if (this.editingVehicle) {
      this.vehicleService.updateVehicle(
        this.editingVehicle.id,
        payload
      ).subscribe({
        next: (vehicle) => {
          this.uploadPhotoAfterSave(vehicle.id);
        },
        error: (error) => {
          console.error('Error al actualizar vehículo:', error);
          alert(error.error?.detail || 'No se pudo actualizar el vehículo');
        }
      });

    } else {
      this.vehicleService.createVehicle(payload).subscribe({
        next: (vehicle) => {
          this.uploadPhotoAfterSave(vehicle.id);
        },
        error: (error) => {
          console.error('Error al guardar vehículo:', error);
          alert(error.error?.detail || 'No se pudo guardar el vehículo');
        }
      });
    }
  }

  uploadPhotoAfterSave(vehicleId: number) {
    if (!this.selectedPhotoFile) {
      this.closeModal();
      this.loadVehicles();
      return;
    }

    this.vehicleService.uploadVehiclePhoto(
      vehicleId,
      this.selectedPhotoFile
    ).subscribe({
      next: () => {
        this.closeModal();
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al subir foto:', error);
        alert('El vehículo se guardó, pero no se pudo subir la foto');
        this.closeModal();
        this.loadVehicles();
      }
    });
  }

  handleDeactivate(vehicle: Vehicle) {
    const confirmDeactivate = confirm(
      `¿Está seguro de dar de baja el vehículo ${vehicle.plate}?`
    );

    if (!confirmDeactivate) return;

    this.vehicleService.deactivateVehicle(vehicle.id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al dar de baja:', error);
        alert('No se pudo dar de baja el vehículo');
      }
    });
  }

  handleActivate(vehicle: Vehicle) {
    const confirmActivate = confirm(
      `¿Está seguro de reactivar el vehículo ${vehicle.plate}?`
    );

    if (!confirmActivate) return;

    this.vehicleService.activateVehicle(vehicle.id).subscribe({
      next: () => {
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al reactivar:', error);
        alert('No se pudo reactivar el vehículo');
      }
    });
  }

  handleDelete(id: number) {
    const confirmDelete = confirm(
      '¿Está seguro de eliminar este vehículo definitivamente? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => {
        if (this.selectedVehicle?.id === id) {
          this.backToList();
        }

        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al eliminar vehículo:', error);
        alert('No se pudo eliminar el vehículo');
      }
    });
  }

  closeModal() {
    this.showForm = false;
    this.selectedPhotoFile = null;
  }

  closeHistoryModal() {
    this.showNewHistoryForm = false;
    this.editingHistory = null;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-700';
      case 'inactive':
        return 'bg-red-100 text-red-700';
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

  getManagementStatusLabel(status: string): string {
    return status === 'active' ? 'En administración' : 'Dado de baja';
  }

  getServiceTypeLabel(type: string): string {
    return type === 'radio_taxi' ? 'Radio taxi' : 'Taxi';
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'mantenimiento_general':
        return 'Mantenimiento general';
      case 'accidente':
        return 'Accidente';
      case 'liquido_frenos':
        return 'Líquido de frenos';
      case 'pastillas':
        return 'Pastillas';
      case 'cambio_llantas':
        return 'Cambio de llantas';
      case 'disco_embrague_remache':
        return 'Disco embrague - Remache';
      case 'disco_embrague_kit':
        return 'Disco embrague - Cambio de kit';
      case 'pintura':
        return 'Pintura';
      case 'chaperio':
        return 'Chaperío';
      default:
        return category;
    }
  }
assignDriverByAccidentDate() {
  if (!this.selectedVehicle || !this.historyForm.event_date) {
    return;
  }

  const accidentDate = this.historyForm.event_date;

  const shiftFound = this.shifts.find(shift => {
    if (
      Number(shift.vehicle_id) !== Number(this.selectedVehicle?.id) ||
      Number(shift.is_active) !== 1
    ) {
      return false;
    }

    const shiftStartDate = shift.start_time.split('T')[0];
    const shiftEndDate = shift.end_time.split('T')[0];

    return accidentDate >= shiftStartDate && accidentDate <= shiftEndDate;
  });

  if (shiftFound?.driver_id) {
    this.historyForm.driver_id = Number(shiftFound.driver_id);
    return;
  }

  const todayDriverId = this.getTodayDriverId(this.selectedVehicle);

  if (todayDriverId) {
    this.historyForm.driver_id = Number(todayDriverId);
    return;
  }

  this.historyForm.driver_id = this.selectedVehicle.current_driver_id || null;
}

  getVehicleAssignedDrivers(vehicleId: number): number[] {
    const shiftDriverIds = this.shifts
      .filter(shift =>
        Number(shift.vehicle_id) === Number(vehicleId) &&
        shift.driver_id !== null &&
        shift.driver_id !== undefined &&
        Number(shift.is_active) === 1
      )
      .map(shift => Number(shift.driver_id));

    const directDriverIds = this.drivers
      .filter(driver =>
        Number(driver.vehicle_id) === Number(vehicleId) &&
        driver.status !== 'inactive'
      )
      .map(driver => Number(driver.id));

    return [...new Set([...shiftDriverIds, ...directDriverIds])];
  }

  get selectedVehicleDriverHistory() {
    if (!this.selectedVehicle) {
      return [];
    }

    return this.shifts
      .filter(shift =>
        Number(shift.vehicle_id) === Number(this.selectedVehicle?.id) &&
        shift.driver_id !== null
      )
      .sort((a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
  }

  getTodayDriverId(vehicle: Vehicle): number | null {
    const assignedDrivers = this.getVehicleAssignedDrivers(vehicle.id);

    if (assignedDrivers.length === 0) {
      return vehicle.current_driver_id || null;
    }

    if (vehicle.management_type === 'solo') {
      return assignedDrivers[0];
    }

    const activeShifts = this.shifts
      .filter(shift =>
        Number(shift.vehicle_id) === Number(vehicle.id) &&
        shift.driver_id !== null &&
        shift.driver_id !== undefined &&
        Number(shift.is_active) === 1
      )
      .sort((a, b) => Number(a.turn_order) - Number(b.turn_order));

    const firstShiftDate = activeShifts[0].start_time.split('T')[0];

    const start = new Date(firstShiftDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    const index = Math.abs(diffDays) % assignedDrivers.length;

    return assignedDrivers[index];
  }

  getDriverNameById(driverId: number | null): string {
    if (!driverId) {
      return 'Sin chofer';
    }

    const driver = this.drivers.find(driver => driver.id === driverId);

    return driver ? driver.name : `Chofer ID ${driverId}`;
  }
}