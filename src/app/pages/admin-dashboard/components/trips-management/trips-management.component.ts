import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  TripService,
  Trip,
  TripRequest
} from '../../../../services/trip.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-trips-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trips-management.component.html',
  styleUrls: ['./trips-management.component.css']
})
export class TripsManagementComponent implements OnInit {

  trips: Trip[] = [];

  drivers: Driver[] = [];

  vehicles: Vehicle[] = [];

  showForm = false;

  editingTrip: Trip | null = null;

  searchTerm = '';

  tripForm: TripRequest = {

    origin: '',
    destination: '',

    trip_date: '',

    price: 0,

    status: 'pending',

    driver_id: null,

    vehicle_id: null,

    passenger_name: '',

    passenger_phone: '',

    observations: ''
  };

  constructor(
    private tripService: TripService,
    private driverService: DriverService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadTrips();
    this.loadDrivers();
    this.loadVehicles();
  }

  loadTrips() {

    this.tripService.getTrips().subscribe({
      next: (data) => {
        console.log('Trips:', data);
        this.trips = data;
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
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

  get filteredTrips() {

    return this.trips.filter(trip =>

      trip.origin.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      ) ||

      trip.destination.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      ) ||

      (trip.passenger_name || '')
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase())
    );
  }

  getDriverName(driverId: number | null): string {

    if (!driverId) {
      return 'Sin conductor';
    }

    return (
      this.drivers.find(
        driver => driver.id === driverId
      )?.name || 'N/A'
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

  openNewTripForm() {

    this.editingTrip = null;

    this.tripForm = {

      origin: '',
      destination: '',

      trip_date: '',

      price: 0,

      status: 'pending',

      driver_id: null,

      vehicle_id: null,

      passenger_name: '',

      passenger_phone: '',

      observations: ''
    };

    this.showForm = true;
  }

  handleEdit(trip: Trip) {

    this.editingTrip = trip;

    this.tripForm = {

      origin: trip.origin,
      destination: trip.destination,

      trip_date: trip.trip_date,

      price: trip.price,

      status: trip.status,

      driver_id: trip.driver_id,

      vehicle_id: trip.vehicle_id,

      passenger_name: trip.passenger_name,

      passenger_phone: trip.passenger_phone,

      observations: trip.observations
    };

    this.showForm = true;
  }

  saveTrip() {

    if (this.editingTrip) {

      this.tripService.updateTrip(
        this.editingTrip.id,
        this.tripForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadTrips();
        },
        error: (error) => {
          console.error('Error al actualizar viaje:', error);
        }
      });

    } else {

      this.tripService.createTrip(
        this.tripForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadTrips();
        },
        error: (error) => {
          console.error('Error al guardar viaje:', error);
        }
      });

    }

  }

  handleDelete(id: number) {

    const confirmed = confirm(
      '¿Eliminar viaje?'
    );

    if (!confirmed) {
      return;
    }

    this.tripService.deleteTrip(id).subscribe({
      next: () => {
        this.loadTrips();
      },
      error: (error) => {
        console.error('Error al eliminar viaje:', error);
      }
    });
  }

  closeModal() {
    this.showForm = false;
  }

  getStatusColor(status: string): string {

    switch (status) {

      case 'completed':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'completed':
        return 'Completado';

      case 'pending':
        return 'Pendiente';

      case 'cancelled':
        return 'Cancelado';

      default:
        return status;
    }
  }
}