import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import {
  OwnerService,
  Owner,
  OwnerRequest
} from '../../../../services/owner.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

@Component({
  selector: 'app-owners-management',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './owners-management.component.html',
  styleUrls: ['./owners-management.component.css']
})
export class OwnersManagementComponent implements OnInit {

  owners: Owner[] = [];
  vehicles: Vehicle[] = [];


  mapCenter: google.maps.LatLngLiteral = {
    lat: -16.5000,
    lng: -68.1500
  };

  mapZoom = 13;

  showForm = false;

  editingOwner: Owner | null = null;
  selectedOwner: Owner | null = null;

  searchTerm = '';

  ownerForm: OwnerRequest = {
    name: '',
    ci: '',
    phone: '',
    email: '',
    address: '',
    address_lat: null,
    address_lng: null,
    status: 'active',
    join_date: null
  };

  constructor(
    private ownerService: OwnerService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.loadOwners();
    this.loadVehicles();
  }

  loadOwners() {
    this.ownerService.getOwners().subscribe({
      next: (data) => {
        console.log('Owners:', data);
        this.owners = data;
      },
      error: (error) => {
        console.error('Error al cargar propietarios:', error);
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

  get filteredOwners() {
    return this.owners.filter(owner =>
      owner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (owner.email || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleEdit(owner: Owner) {

    this.editingOwner = owner;

    this.ownerForm = {
      name: owner.name,
      ci: owner.ci,
      phone: owner.phone,
      email: owner.email,
      address: owner.address,
      address_lat: owner.address_lat,
      address_lng: owner.address_lng,
      status: owner.status,
      join_date: owner.join_date
    };

    if (owner.address_lat && owner.address_lng) {
      this.mapCenter = {
        lat: owner.address_lat,
        lng: owner.address_lng
      };
}

    this.showForm = true;
  }

  handleDelete(id: number) {

    const confirmDelete = confirm(
      '¿Eliminar propietario?'
    );

    if (!confirmDelete) {
      return;
    }

    this.ownerService.deleteOwner(id).subscribe({
      next: () => {
        this.loadOwners();
      },
      error: (error) => {
        console.error('Error al eliminar propietario:', error);
        alert('No se pudo eliminar');
      }
    });
  }

  openNewOwnerForm() {

    this.editingOwner = null;

    this.ownerForm = {
      name: '',
      ci: '',
      phone: '',
      email: '',
      address: '',
      address_lat: null,
      address_lng: null,
      status: 'active',
      join_date: null
    };

    this.showForm = true;
  }

  validateOwnerForm(): boolean {
    if (!this.ownerForm.name || !this.ownerForm.name.trim()) {
      alert('Debe ingresar el nombre del propietario');
      return false;
    }

    if (!this.ownerForm.ci || !this.ownerForm.ci.trim()) {
      alert('Debe ingresar el CI del propietario');
      return false;
    }

    if (!this.ownerForm.phone || !this.ownerForm.phone.trim()) {
      alert('Debe ingresar el teléfono del propietario');
      return false;
    }

    if (!this.ownerForm.email || !this.ownerForm.email.trim()) {
      alert('Debe ingresar el email del propietario');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.ownerForm.email)) {
      alert('Debe ingresar un email válido');
      return false;
    }

    if (!this.ownerForm.address || !this.ownerForm.address.trim()) {
      alert('Debe ingresar o seleccionar una dirección');
      return false;
    }

    if (!this.ownerForm.address_lat || !this.ownerForm.address_lng) {
      alert('Debe seleccionar la ubicación en el mapa');
      return false;
    }

    if (!this.ownerForm.join_date) {
      alert('Debe ingresar la fecha de registro');
      return false;
    }

    return true;
  }

  selectOwner(owner: Owner) {
  this.selectedOwner = owner;
}

backToList() {
  this.selectedOwner = null;
}

get selectedOwnerVehicles() {
  if (!this.selectedOwner) {
    return [];
  }

  return this.vehicles.filter(vehicle =>
    Number(vehicle.owner_id) === Number(this.selectedOwner?.id)
  );
}

  saveOwner() {

    if (!this.validateOwnerForm()) {
      return;
    }

    if (this.editingOwner) {

      this.ownerService.updateOwner(
        this.editingOwner.id,
        this.ownerForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadOwners();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
        }
      });

    } else {

      this.ownerService.createOwner(this.ownerForm).subscribe({
        next: () => {
          this.closeModal();
          this.loadOwners();
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        }
      });

    }

  }

  closeModal() {
    this.showForm = false;
  }
  selectLocation(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.ownerForm.address_lat = lat;
    this.ownerForm.address_lng = lng;

    this.mapCenter = { lat, lng };

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          this.ownerForm.address = results[0].formatted_address;
        } else {
          this.ownerForm.address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        }
      }
    );
  }
  searchAddressOnMap() {
    if (!this.ownerForm.address) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { address: this.ownerForm.address },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;

          const lat = location.lat();
          const lng = location.lng();

          this.ownerForm.address_lat = lat;
          this.ownerForm.address_lng = lng;

          this.mapCenter = { lat, lng };

          this.ownerForm.address = results[0].formatted_address;
        }
      }
    );
  }
  openOwnerLocation(owner: Owner) {
    if (!owner.address_lat || !owner.address_lng) {
      alert('Este propietario no tiene ubicación registrada');
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${owner.address_lat},${owner.address_lng}`,
      '_blank'
    );
  }
}