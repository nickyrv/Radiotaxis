import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import {
  DriverService,
  Driver,
  DriverRequest
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

import {
  PaymentService,
  Payment
} from '../../../../services/payment.service';

import {
  VehicleHistoryService,
  VehicleHistory
} from '../../../../services/vehicle-history.service';

import {
  ShiftService,
  Shift
} from '../../../../services/shift.service';

import {
  ShiftDayService
} from '../../../../services/shift-day.service';

@Component({
  selector: 'app-drivers-management',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './drivers-management.component.html',
  styleUrls: ['./drivers-management.component.css']
})
export class DriversManagementComponent implements OnInit {

  drivers: Driver[] = [];
  vehicles: Vehicle[] = [];
  payments: Payment[] = [];
  shifts: Shift[] = [];
  vehicleHistory: VehicleHistory[] = [];
  paymentVehicleFilter = '';
  paymentStartDate = '';
  paymentEndDate = '';
  showForm = false;
  showImageModal = false;
  selectedImageUrl = '';
  selectedImageTitle = '';
  editingDriver: Driver | null = null;
  selectedPhotoFile: File | null = null;
  selectedHouseDoorFile: File | null = null;
  selectedCiFrontFile: File | null = null;
  selectedCiBackFile: File | null = null;
  selectedElectricityBillFile: File | null = null;
  selectedCriminalRecordFile: File | null = null;
  selectedDriver: Driver | null = null;
  showStartShiftModal = false;
  pendingShiftDriver: Driver | null = null;
  pendingShiftVehicleId: number | null = null;
  mapCenter: google.maps.LatLngLiteral = {
    lat: -16.5000,
    lng: -68.1500
  };
  mapZoom = 13;
  searchTerm = '';
  driverForm: DriverRequest = this.getEmptyDriverForm();

  constructor(
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private paymentService: PaymentService,
    private vehicleHistoryService: VehicleHistoryService,
    private shiftService: ShiftService,
    private shiftDayService: ShiftDayService
  ) {}

  ngOnInit() {
    this.loadDrivers();
    this.loadVehicles();
    this.loadPayments();
    this.loadVehicleHistory();
    this.loadShifts();
  }

  selectDriver(driver: Driver) {
    this.selectedDriver = driver;
  }

  backToList() {
    this.selectedDriver = null;
  }

  openImageModal(
    imageUrl: string,
    title: string
  ) {
    this.selectedImageUrl = imageUrl;
    this.selectedImageTitle = title;
    this.showImageModal = true;
  }

  closeImageModal() {
    this.showImageModal = false;
    this.selectedImageUrl = '';
    this.selectedImageTitle = '';
  }

  getEmptyDriverForm(): DriverRequest {
    return {
      name: '',
      ci: '',
      phone: '',
      email: '',

      license: '',
      license_expiry: null,
      license_category: '',

      has_tic: false,

      address: '',
      address_lat: null,
      address_lng: null,

      photo_url: '',
      house_door_photo_url: '',
      ci_front_photo_url: '',
      ci_back_photo_url: '',
      electricity_bill_photo_url: '',
      criminal_record_pdf_url: '',
      status: 'active',

      vehicle_id: null
    };
  }
  onCriminalRecordSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedCriminalRecordFile = null;
      return;
    }

    this.selectedCriminalRecordFile = input.files[0];
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

  selectLocation(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    this.driverForm.address_lat = lat;
    this.driverForm.address_lng = lng;

    this.mapCenter = { lat, lng };

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          this.driverForm.address = results[0].formatted_address;
        } else {
          this.driverForm.address = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
        }
      }
    );
  }

  searchAddressOnMap() {
    if (!this.driverForm.address) return;

    const geocoder = new google.maps.Geocoder();

    geocoder.geocode(
      { address: this.driverForm.address },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;

          const lat = location.lat();
          const lng = location.lng();

          this.driverForm.address_lat = lat;
          this.driverForm.address_lng = lng;

          this.mapCenter = { lat, lng };

          this.driverForm.address = results[0].formatted_address;
        }
      }
    );
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

  loadPayments() {
    this.paymentService.getPayments().subscribe({
      next: (data) => {
        this.payments = data;
      },
      error: (error) => {
        console.error('Error al cargar pagos:', error);
      }
    });
  }

  loadVehicleHistory() {
    this.vehicleHistoryService.getAllHistory().subscribe({
      next: (data) => {
        this.vehicleHistory = data;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
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

  get availableVehicles() {
    return this.vehicles.filter(vehicle =>
      vehicle.management_status !== 'inactive'
    );
  }

  get filteredDrivers() {
    const term = this.searchTerm.toLowerCase();

    return this.drivers.filter(driver =>
      driver.name.toLowerCase().includes(term) ||
      (driver.license || '').toLowerCase().includes(term) ||
      (driver.ci || '').toLowerCase().includes(term) ||
      (driver.phone || '').toLowerCase().includes(term)
    );
  }

  get driverPayments() {
    if (!this.selectedDriver) {
      return [];
    }

    return this.payments.filter(payment => {

      const matchesDriver =
        payment.driver_id === this.selectedDriver?.id;

      const matchesVehicle =
        !this.paymentVehicleFilter ||
        String(payment.vehicle_id) === this.paymentVehicleFilter;

      const paymentDate = payment.payment_date;

      const matchesStart =
        !this.paymentStartDate ||
        paymentDate >= this.paymentStartDate;

      const matchesEnd =
        !this.paymentEndDate ||
        paymentDate <= this.paymentEndDate;

      return (
        matchesDriver &&
        matchesVehicle &&
        matchesStart &&
        matchesEnd
      );
    });
  }

  get driverAccidents() {
    if (!this.selectedDriver) {
      return [];
    }

    return this.vehicleHistory.filter(history =>
      history.driver_id === this.selectedDriver?.id &&
      (history.category || '').toLowerCase().includes('accidente')
    );
  }

  get driverVehicleHistory() {
    if (!this.selectedDriver) {
      return [];
    }

    return this.vehicles.filter(vehicle =>
      vehicle.id === this.selectedDriver?.vehicle_id
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

 getVehicleAssignedDrivers(vehicleId: number): number[] {

    return this.drivers
      .filter(driver =>
        Number(driver.vehicle_id) === Number(vehicleId) &&
        driver.status === 'active'
      )
      .map(driver => Number(driver.id));

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
      license_category: driver.license_category,

      has_tic: driver.has_tic,

      address: driver.address,
      address_lat: driver.address_lat,
      address_lng: driver.address_lng,

      photo_url: driver.photo_url,
      house_door_photo_url: driver.house_door_photo_url,
      ci_front_photo_url: driver.ci_front_photo_url,
      ci_back_photo_url: driver.ci_back_photo_url,
      electricity_bill_photo_url: driver.electricity_bill_photo_url,
      criminal_record_pdf_url: driver.criminal_record_pdf_url,
      status: driver.status,

      vehicle_id: driver.vehicle_id
    };

    if (driver.address_lat && driver.address_lng) {
      this.mapCenter = {
        lat: driver.address_lat,
        lng: driver.address_lng
      };
    }

    this.selectedPhotoFile = null;
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
        if (this.selectedDriver?.id === id) {
          this.backToList();
        }
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
      license_category: driver.license_category,

      has_tic: driver.has_tic,

      address: driver.address,
      address_lat: driver.address_lat,

      address_lng: driver.address_lng,

      photo_url: driver.photo_url,
      house_door_photo_url: driver.house_door_photo_url,
      ci_front_photo_url: driver.ci_front_photo_url,
      ci_back_photo_url: driver.ci_back_photo_url,
      electricity_bill_photo_url: driver.electricity_bill_photo_url,
      criminal_record_pdf_url: driver.criminal_record_pdf_url,
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

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.selectedPhotoFile = null;
      return;
    }

    this.selectedPhotoFile = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.driverForm.photo_url = reader.result as string;
    };

    reader.readAsDataURL(this.selectedPhotoFile);
  }

  validateDriverForm(): boolean {
    if (!this.driverForm.name || !this.driverForm.name.trim()) {
      alert('Debe ingresar el nombre del conductor');
      return false;
    }

    if (!this.driverForm.ci || !this.driverForm.ci.trim()) {
      alert('Debe ingresar el CI del conductor');
      return false;
    }

    if (!this.driverForm.phone || !this.driverForm.phone.trim()) {
      alert('Debe ingresar el teléfono del conductor');
      return false;
    }

    if (!this.driverForm.email || !this.driverForm.email.trim()) {
      alert('Debe ingresar el correo del conductor');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.driverForm.email)) {
      alert('Debe ingresar un correo válido');
      return false;
    }

    if (!this.driverForm.license || !this.driverForm.license.trim()) {
      alert('Debe ingresar la licencia del conductor');
      return false;
    }

    if (!this.driverForm.license_category) {
      alert('Debe seleccionar la categoría de licencia');
      return false;
    }

    if (!this.driverForm.license_expiry) {
      alert('Debe ingresar la fecha de vencimiento de la licencia');
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(this.driverForm.license_expiry);

    if (expiryDate < today) {
      alert('La licencia no puede estar vencida');
      return false;
    }

    if (!this.driverForm.address || !this.driverForm.address.trim()) {
      alert('Debe ingresar la dirección del conductor');
      return false;
    }

    return true;
  }

  onDriverDocumentSelected(
    event: Event,
    documentType: 'house_door' | 'ci_front' | 'ci_back' | 'electricity_bill'
  ) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    if (documentType === 'house_door') {
      this.selectedHouseDoorFile = file;
    }

    if (documentType === 'ci_front') {
      this.selectedCiFrontFile = file;
    }

    if (documentType === 'ci_back') {
      this.selectedCiBackFile = file;
    }

    if (documentType === 'electricity_bill') {
      this.selectedElectricityBillFile = file;
    }
  }

  saveDriver() {
    if (!this.validateDriverForm()) {
      return;
    }

    const payload: DriverRequest = {
      ...this.driverForm,
      photo_url: this.selectedPhotoFile
        ? this.editingDriver?.photo_url || null
        : this.driverForm.photo_url
    };

    if (this.editingDriver) {
      this.driverService.updateDriver(
        this.editingDriver.id,
        payload
      ).subscribe({
        next: (driver) => {
          this.uploadPhotoAfterSave(driver.id);

          if (driver.vehicle_id) {
            this.pendingShiftDriver = driver;
            this.pendingShiftVehicleId = driver.vehicle_id;
            this.showStartShiftModal = true;
          }
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
          alert(error.error?.detail || 'No se pudo actualizar el conductor');
        }
      });

    } else {
      this.driverService.createDriver(
        payload
      ).subscribe({
        next: (driver) => {
          this.uploadPhotoAfterSave(driver.id);

          if (driver.vehicle_id) {
            this.pendingShiftDriver = driver;
            this.pendingShiftVehicleId = driver.vehicle_id;
            this.showStartShiftModal = true;
          }
        },
        error: (error) => {
          console.error('Error al guardar:', error);
          alert(error.error?.detail || 'No se pudo guardar el conductor');
        }
      });
    }
  }

  async uploadPhotoAfterSave(driverId: number) {
    try {
      if (this.selectedPhotoFile) {
        await this.driverService
          .uploadDriverPhoto(driverId, this.selectedPhotoFile)
          .toPromise();
      }

      if (this.selectedHouseDoorFile) {
        await this.driverService
          .uploadDriverDocument(
            driverId,
            'house_door',
            this.selectedHouseDoorFile
          )
          .toPromise();
      }

      if (this.selectedCiFrontFile) {
        await this.driverService
          .uploadDriverDocument(
            driverId,
            'ci_front',
            this.selectedCiFrontFile
          )
          .toPromise();
      }

      if (this.selectedCiBackFile) {
        await this.driverService
          .uploadDriverDocument(
            driverId,
            'ci_back',
            this.selectedCiBackFile
          )
          .toPromise();
      }

      if (this.selectedElectricityBillFile) {
        await this.driverService
          .uploadDriverDocument(
            driverId,
            'electricity_bill',
            this.selectedElectricityBillFile
          )
          .toPromise();
      }

      if (this.selectedCriminalRecordFile) {
        await this.driverService
          .uploadCriminalRecord(
            driverId,
            this.selectedCriminalRecordFile
          )
          .toPromise();
      }

      this.closeModal();
      this.refreshDriversAndSelected();

    } catch (error) {
      console.error(error);

      alert(
        'El conductor fue guardado, pero ocurrió un problema al subir algún documento.'
      );

      this.closeModal();
      this.refreshDriversAndSelected();
    }
  }

  refreshDriversAndSelected() {
    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data;

        if (this.selectedDriver) {
          this.selectedDriver =
            this.drivers.find(
              driver => driver.id === this.selectedDriver?.id
            ) || null;
        }
      },
      error: (error) => {
        console.error('Error al recargar conductores:', error);
      }
    });
  }

  openNewDriverForm() {
    this.editingDriver = null;
    this.driverForm = this.getEmptyDriverForm();
    this.selectedPhotoFile = null;
    this.showForm = true;
    this.selectedHouseDoorFile = null;
    this.selectedCiFrontFile = null;
    this.selectedCiBackFile = null;
    this.selectedElectricityBillFile = null;
  }

  closeStartShiftModal() {
    this.showStartShiftModal = false;
    this.pendingShiftDriver = null;
    this.pendingShiftVehicleId = null;
  }

  confirmStartShiftToday() {
    if (!this.pendingShiftDriver || !this.pendingShiftVehicleId) {
      return;
    }

    const vehicle = this.vehicles.find(
      v => Number(v.id) === Number(this.pendingShiftVehicleId)
    );

    if (!vehicle) {
      alert('Vehículo no encontrado');
      return;
    }

    const assignedDriverIds = this.getVehicleAssignedDrivers(
      this.pendingShiftVehicleId
    );

    const today = new Date().toISOString().split('T')[0];

    this.shiftDayService.programShiftDays({
      vehicle_id: this.pendingShiftVehicleId,
      driver_ids: assignedDriverIds,
      start_date: today,
      days_to_generate: 30
    }).subscribe({
      next: () => {
        alert('Rol de turnos programado correctamente');
        this.closeStartShiftModal();
        this.loadDrivers();
        this.loadVehicles();
      },
      error: (error) => {
        console.error('Error al programar turnos:', error);
        alert('No se pudo programar el rol de turnos');
      }
    });
  }

  closeModal() {
    this.showForm = false;
    this.selectedPhotoFile = null;
    this.selectedHouseDoorFile = null;
    this.selectedCiFrontFile = null;
    this.selectedCiBackFile = null;
    this.selectedElectricityBillFile = null;
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
  openDriverLocation(driver: Driver) {
    if (!driver.address_lat || !driver.address_lng) {
      alert('Este conductor no tiene ubicación registrada');
      return;
    }

    window.open(
      `https://www.google.com/maps?q=${driver.address_lat},${driver.address_lng}`,
      '_blank'
    );
  }
}
