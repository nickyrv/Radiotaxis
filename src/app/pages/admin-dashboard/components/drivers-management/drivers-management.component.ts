import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  DriverService,
  Driver,
  DriverRequest
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-drivers-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drivers-management.component.html',
  styleUrls: ['./drivers-management.component.css']
})
export class DriversManagementComponent implements OnInit {

  drivers: Driver[] = [];

  vehicles: Vehicle[] = [];

  showForm = false;

  editingDriver: Driver | null = null;

  searchTerm = '';

  driverForm: DriverRequest = {

    name: '',
    ci: '',
    phone: '',
    email: '',

    license: '',
    license_expiry: null,

    address: '',

    status: 'active',

    vehicle_id: null
  };

  constructor(
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
  }

  loadDrivers() {

    this.driverService.getDrivers().subscribe({
      next: (data) => {
        console.log('Drivers:', data);
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

  get filteredDrivers() {

    return this.drivers.filter(driver =>
      driver.name.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      ) ||

      (driver.license || '')
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  getVehiclePlate(vehicleId: number | null): string {

    if (!vehicleId) {
      return 'Sin vehículo';
    }

    return (
      this.vehicles.find(
        vehicle => vehicle.id === vehicleId
      )?.plate || 'N/A'
    );
  }

  handleEdit(driver: Driver) {

    this.editingDriver = driver;

    this.driverForm = {

      name: driver.name,
      ci: driver.ci,
      phone: driver.phone,
      email: driver.email,

      license: driver.license,
      license_expiry: driver.license_expiry,

      address: driver.address,

      status: driver.status,

      vehicle_id: driver.vehicle_id
    };

    this.showForm = true;
  }

  handleDelete(id: number) {

    const confirmed = confirm(
      '¿Eliminar conductor?'
    );

    if (!confirmed) {
      return;
    }

    this.driverService.deleteDriver(id).subscribe({
      next: () => {
        this.loadDrivers();
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
      }
    });
  }

  handleToggleBlock(driver: Driver) {

    const newStatus =
      driver.status === 'blocked'
        ? 'active'
        : 'blocked';

    const updatedDriver: DriverRequest = {

      name: driver.name,
      ci: driver.ci,
      phone: driver.phone,
      email: driver.email,

      license: driver.license,
      license_expiry: driver.license_expiry,

      address: driver.address,

      status: newStatus,

      vehicle_id: driver.vehicle_id
    };

    this.driverService.updateDriver(
      driver.id,
      updatedDriver
    ).subscribe({
      next: () => {
        this.loadDrivers();
      },
      error: (error) => {
        console.error('Error al bloquear:', error);
      }
    });
  }

  saveDriver() {

    if (this.editingDriver) {

      this.driverService.updateDriver(
        this.editingDriver.id,
        this.driverForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadDrivers();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
        }
      });

    } else {

      this.driverService.createDriver(
        this.driverForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadDrivers();
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        }
      });

    }

  }

  openNewDriverForm() {

    this.editingDriver = null;

    this.driverForm = {

      name: '',
      ci: '',
      phone: '',
      email: '',

      license: '',
      license_expiry: null,

      address: '',

      status: 'active',

      vehicle_id: null
    };

    this.showForm = true;
  }

  closeModal() {
    this.showForm = false;
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