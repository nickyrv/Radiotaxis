import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AlertService,
  Alert,
  AlertRequest
} from '../../../../services/alert.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

import {
  VehicleHistoryService,
  VehicleHistory
} from '../../../../services/vehicle-history.service';

@Component({
  selector: 'app-alerts-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alerts-management.component.html',
  styleUrls: ['./alerts-management.component.css']
})
export class AlertsManagementComponent implements OnInit {

  alerts: Alert[] = [];

  vehicles: Vehicle[] = [];

  drivers: Driver[] = [];

  vehicleHistory: VehicleHistory[] = [];

  activeSection: 'vehicles' | 'drivers' = 'vehicles';

  selectedVehicle: Vehicle | null = null;

  selectedDriver: Driver | null = null;

  searchTerm = '';

  categoryFilter = '';

  statusFilter: 'pending' | 'completed' | 'expired' | 'cancelled' | '' = '';

  showAlertForm = false;

  alertForm: AlertRequest = this.getEmptyAlertForm();
  showCompleteModal = false;
  showHistoryCompleteModal = false;

  selectedHistoryToComplete: VehicleHistory | null = null;

  historyCompleteForm = {
    cost: null as number | null,
    notes: ''
  };

  selectedAlertToComplete: Alert | null = null;

  constructor(
    private alertService: AlertService,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private vehicleHistoryService: VehicleHistoryService
  ) {}

  ngOnInit() {
    this.loadAlerts();
    this.loadVehicles();
    this.loadDrivers();
    this.loadVehicleHistory();
  }

  markHistoryCompleted(history: VehicleHistory) {
  const updatedHistory = {
    vehicle_id: history.vehicle_id,
    driver_id: history.driver_id,
    category: history.category,
    detail: history.detail,
    event_date: history.event_date,
    cost: history.cost,
    description: history.description,
    maintenance_status: 'completed',
    completed_date: this.getTodayLocalDate()
  };

  this.vehicleHistoryService.updateHistory(
    history.id,
    updatedHistory
  ).subscribe({
    next: () => {
      this.closeHistoryCompleteModal();

      this.loadVehicleHistory();
    },
    error: (error) => {
      console.error('Error al marcar mantenimiento como realizado:', error);
      alert('No se pudo actualizar el mantenimiento');
    }
  });
}

markHistoryCancelled(history: VehicleHistory) {
  const updatedHistory = {
    vehicle_id: history.vehicle_id,
    driver_id: history.driver_id,
    category: history.category,
    detail: history.detail,
    event_date: history.event_date,
    cost: history.cost,
    description: history.description,
    maintenance_status: 'cancelled',
    completed_date: null
  };

  this.vehicleHistoryService.updateHistory(
    history.id,
    updatedHistory
  ).subscribe({
    next: () => {
      this.loadVehicleHistory();
    },
    error: (error) => {
      console.error('Error al marcar mantenimiento como no realizado:', error);
      alert('No se pudo actualizar el mantenimiento');
    }
  });
}

  loadAlerts() {
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
      },
      error: (error) => {
        console.error('Error al cargar alertas:', error);
      }
    });
  }

  loadVehicleHistory() {
    this.vehicleHistoryService.getAllHistory().subscribe({
      next: (data) => {
        this.vehicleHistory = data;
        console.log('Historial cargado en alertas:', this.vehicleHistory);
      },
      error: (error) => {
        console.error('Error al cargar historial de vehículos:', error);
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
  openHistoryCompleteModal(history: VehicleHistory) {

    this.selectedHistoryToComplete = history;

    this.historyCompleteForm = {
      cost: history.cost,
      notes: ''
    };

    this.showHistoryCompleteModal = true;
  }

  closeHistoryCompleteModal() {

    this.showHistoryCompleteModal = false;

    this.selectedHistoryToComplete = null;
  }

  

  confirmHistoryCompleted() {

    if (!this.selectedHistoryToComplete) {
      return;
    }

    const updatedHistory = {
      vehicle_id: this.selectedHistoryToComplete.vehicle_id,
      driver_id: this.selectedHistoryToComplete.driver_id,
      category: this.selectedHistoryToComplete.category,
      detail: this.selectedHistoryToComplete.detail,
      event_date: this.selectedHistoryToComplete.event_date,
      cost: this.historyCompleteForm.cost,
      
      description: this.cleanHistoryDescription(
        this.selectedHistoryToComplete.description
      ),
      maintenance_status: 'completed',
      completed_date: this.getTodayLocalDate()
    };

    this.vehicleHistoryService.updateHistory(
      this.selectedHistoryToComplete.id,
      updatedHistory
    ).subscribe({
      next: () => {

        this.loadVehicleHistory();

        this.closeHistoryCompleteModal();

      },
      error: (error) => {

        console.error(error);

        alert('No se pudo actualizar');

      }
    });
  }

  getTodayLocalDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getCompletedHistoryLabel(history: VehicleHistory): string {
    const days = this.getDaysUntil(history.event_date);

    if (days !== null && days < 0) {
      return `Realizada con atraso de ${Math.abs(days)} día(s)`;
    }

    if (days === 0) {
      return 'Realizada en fecha límite';
    }

    if (days !== null && days > 0) {
      return `Realizada ${days} día(s) antes del vencimiento`;
    }

    return 'Realizada';
  }

  getEmptyAlertForm(): AlertRequest {
  return {
    title: '',
    description: '',
    type: 'vehicle',
    severity: 'low',
    status: 'pending',

    alert_date: new Date().toISOString().split('T')[0],
    due_date: null,
    completed_date: null,

    related_entity: null,
    related_id: null,

    vehicle_id: null,
    driver_id: null,

    category: '',

    estimated_cost: null,
    final_cost: null,

    notes: '',

    is_recurring: false,
    recurrence_value: null,
    recurrence_unit: null
  };

}

completeForm = {
  final_cost: null as number | null,
  notes: ''
};

  selectVehicle(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    this.selectedDriver = null;

    this.searchTerm = '';
    this.categoryFilter = '';
    this.statusFilter = '';
  }

  selectDriver(driver: Driver) {
    this.selectedDriver = driver;
    this.selectedVehicle = null;
  }

  backToCards() {
    this.selectedVehicle = null;
    this.selectedDriver = null;

    this.searchTerm = '';
    this.categoryFilter = '';
    this.statusFilter = '';
  }

  setSection(section: 'vehicles' | 'drivers') {
    this.activeSection = section;
    this.backToCards();
  }

  getVehicleName(vehicleId: number | null): string {
    if (!vehicleId) return 'Sin vehículo';

    const vehicle = this.vehicles.find(v =>
      Number(v.id) === Number(vehicleId)
    );

    return vehicle
      ? `${vehicle.radio_code || vehicle.plate} - ${vehicle.plate}`
      : 'Vehículo no encontrado';
  }

  getVehicleHistoryAlerts(vehicleId: number): VehicleHistory[] {
    return this.vehicleHistory.filter(history =>
      Number(history.vehicle_id) === Number(vehicleId) &&
      (history.category || '').toLowerCase() !== 'accidente'
    );
  }
  getVehicleHistoryAlertsBySeverity(
    vehicleId: number,
    severity: string
  ): VehicleHistory[] {
    return this.getVehicleHistoryAlerts(vehicleId).filter(history =>
      this.getCalculatedSeverityForAny(history) === severity
    );
  }

  countVehiclePendingHistory(vehicleId: number): number {
  return this.getVehicleHistoryAlerts(vehicleId).filter(history =>
    history.maintenance_status === 'pending'
  ).length;
}

  getVehicleAllAlertItems(vehicleId: number): any[] {
    return this.getVehicleHistoryAlerts(vehicleId);
  }

  getCalculatedSeverityForAny(item: any): string {
    const status = item.maintenance_status || item.status || 'pending';

    if (status === 'completed') {
      return 'completed';
    }

    if (status === 'cancelled') {
      return 'cancelled';
    }

    const dateToCheck =
      item.event_date ||
      item.due_date ||
      item.alert_date;

    const days = this.getDaysUntil(dateToCheck);

    if (days === null) {
      return 'low';
    }

    if (days < 0) {
      return 'expired';
    }

    if (days >=0 && days <= 2) {
      return 'high';
    }

    if (days >= 3 && days <= 7) {
      return 'medium';
    }

    return 'low';
  }

  countVehicleAllAlertsBySeverity(
    vehicleId: number,
    severity: string
  ): number {
    return this.getVehicleAllAlertItems(vehicleId).filter(item =>
      this.getCalculatedSeverityForAny(item) === severity
    ).length;
  }

  cleanHistoryDescription(description: string | null): string {
    if (!description) {
      return '';
    }

    return description
      .replace(/Realizado en fecha:\s*\d{4}-\d{2}-\d{2}/g, '')
      .replace(/Observación:\s*[^R]*/g, '')
      .trim();
  }
  get availableHistoryCategories(): string[] {
    const categories = this.vehicleHistory
      .map(history => history.category)
      .filter((category): category is string =>
        !!category && category.trim() !== ''
      );

    return [...new Set(categories)];
  }

  getFilteredHistoryForSelectedVehicle(): VehicleHistory[] {
    if (!this.selectedVehicle) {
      return [];
    }

    return this.getVehicleHistoryAlerts(this.selectedVehicle.id)
      .filter(history => {
        const search = this.searchTerm.toLowerCase();

        const matchesSearch =
          !this.searchTerm ||
          (history.detail || '').toLowerCase().includes(search) ||
          (history.description || '').toLowerCase().includes(search) ||
          (history.category || '').toLowerCase().includes(search);

        const matchesCategory =
          !this.categoryFilter ||
          (history.category || '').toLowerCase().trim() ===
          this.categoryFilter.toLowerCase().trim();

        const calculatedStatus =
          this.getCalculatedSeverityForAny(history);

        const matchesStatus =
          !this.statusFilter ||
          history.maintenance_status === this.statusFilter ||
          calculatedStatus === this.statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      });
  }

  getDriverName(driverId: number | null): string {
    if (!driverId) return 'Sin conductor';

    const driver = this.drivers.find(d =>
      Number(d.id) === Number(driverId)
    );

    return driver?.name || 'Conductor no encontrado';
  }

  confirmReopenHistory(history: VehicleHistory) {
    const confirmed = confirm(
      '¿Desea cambiar este mantenimiento realizado nuevamente a pendiente? Use esta opción solo si fue marcado por error.'
    );

    if (!confirmed) {
      return;
    }

    const updatedHistory = {
      vehicle_id: history.vehicle_id,
      driver_id: history.driver_id,
      category: history.category,
      detail: history.detail,
      event_date: history.event_date,
      cost: history.cost,
      description: history.description,
      maintenance_status: 'pending',
      completed_date: null
    };

    this.vehicleHistoryService.updateHistory(
      history.id,
      updatedHistory
    ).subscribe({
      next: () => {
        this.loadVehicleHistory();
      },
      error: (error) => {
        console.error('Error al corregir estado:', error);
        alert('No se pudo corregir el estado');
      }
    });
  }

  getHistoryStatusLabel(history: VehicleHistory): string {

    if (history.maintenance_status === 'completed') {
      const days = this.getDaysUntil(history.event_date);

      if (days !== null && days < 0) {
        return `Realizada con ${Math.abs(days)} día(s) de atraso`;
      }

      if (days === 0) {
        return 'Realizada en fecha límite';
      }

      if (days !== null && days > 0) {
        return `Realizada ${days} día(s) antes del vencimiento`;
      }

      return 'Realizada';
    }

    if (history.maintenance_status === 'cancelled') {
      return 'No realizada';
    }

    const days = this.getDaysUntil(history.event_date);

    if (days !== null && days < 0) {
      return `Vencida (${Math.abs(days)} día(s) de atraso)`;
    }

    if (days !== null && days <= 2) {
      return 'Urgente';
    }

    if (days !== null && days <= 7) {
      return 'Media';
    }

    return 'Normal';
  }

  getHistoryCardColor(history: VehicleHistory): string {

    if (history.maintenance_status === 'completed') {
      return 'bg-green-50 border-green-300';
    }

    if (history.maintenance_status === 'cancelled') {
      return 'bg-gray-100 border-gray-300';
    }

    const days = this.getDaysUntil(history.event_date);

    if (days !== null && days < 0) {
      return 'bg-red-50 border-red-200';
    }

    if (days !== null && days <= 2) {
      return 'bg-red-50 border-red-200';
    }

    if (days !== null && days <= 7) {
      return 'bg-yellow-50 border-yellow-200';
    }

    return 'bg-green-50 border-green-200';
  }

  getHistoryBadge(history: VehicleHistory): string {

    if (history.maintenance_status === 'completed') {
      return 'bg-green-600 text-white';
    }

    if (history.maintenance_status === 'cancelled') {
      return 'bg-gray-200 text-gray-700';
    }

    const days = this.getDaysUntil(history.event_date);

    if (days !== null && days < 0) {
      return 'bg-red-200 text-red-900';
    }

    if (days !== null && days <= 2) {
      return 'bg-red-100 text-red-700';
    }

    if (days !== null && days <= 7) {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-green-100 text-green-700';
  }

  getDaysUntil(dateValue: string | null): number | null {
    if (!dateValue) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = dateValue.split('-');

    if (parts.length !== 3) return null;

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const targetDate = new Date(year, month, day);
    targetDate.setHours(0, 0, 0, 0);

    return Math.ceil(
      (targetDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }

  getCalculatedSeverity(alert: Alert): string {
    if (alert.status === 'completed') return 'completed';
    if (alert.status === 'cancelled') return 'cancelled';

    const days = this.getDaysUntil(alert.due_date || alert.alert_date);

    if (days === null) return alert.severity;

    if (days < 0) return 'expired';
    if (days <= 2) return 'high';
    if (days <= 7) return 'medium';

    return 'low';
  }

  getSeverityLabelFromAlert(alert: Alert): string {
    const severity = this.getCalculatedSeverity(alert);

    switch (severity) {
      case 'expired':
        return 'Vencida / atrasada';
      case 'high':
        return 'Urgente';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Normal';
      case 'completed':
        return 'Realizada';
      case 'cancelled':
        return 'No realizada';
      default:
        return severity;
    }
  }

  getSeverityBadgeFromAlert(alert: Alert): string {
    const severity = this.getCalculatedSeverity(alert);

    switch (severity) {
      case 'expired':
        return 'bg-red-200 text-red-900';
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-gray-200 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getCategoryLabel(category: string | null): string {
    switch (category) {
      case 'liquido_frenos':
        return 'Líquido de frenos';
      case 'aceite':
        return 'Cambio de aceite';
      case 'pastillas':
        return 'Pastillas';
      case 'llantas':
        return 'Llantas';
      case 'soat':
        return 'SOAT';
      case 'licencia':
        return 'Licencia';
      case 'tic':
        return 'TIC';
      case 'documentacion':
        return 'Documentación';
      default:
        return category || 'Sin categoría';
    }
  }

  getVehicleAlerts(vehicleId: number): Alert[] {
    return this.alerts.filter(alert =>
      alert.type === 'vehicle' &&
      Number(alert.vehicle_id || alert.related_id) === Number(vehicleId)
    );
  }

  getDriverAlerts(driverId: number): Alert[] {
    return this.alerts.filter(alert =>
      alert.type === 'driver' &&
      Number(alert.driver_id || alert.related_id) === Number(driverId)
    );
  }

  getFilteredAlertsForSelectedVehicle() {
    if (!this.selectedVehicle) return [];

    return this.getVehicleAlerts(this.selectedVehicle.id)
      .filter(alert => this.applyAlertFilters(alert));
  }

  getFilteredAlertsForSelectedDriver() {
    if (!this.selectedDriver) return [];

    return this.getDriverAlerts(this.selectedDriver.id)
      .filter(alert => this.applyAlertFilters(alert));
  }

  applyAlertFilters(alert: Alert): boolean {
    const matchesSearch =
      !this.searchTerm ||
      alert.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (alert.description || '').toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchesCategory =
      !this.categoryFilter ||
      alert.category === this.categoryFilter;

    const calculated = this.getCalculatedSeverity(alert);

    const matchesStatus =
      !this.statusFilter ||
      alert.status === this.statusFilter ||
      calculated === this.statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  }

  countAlertsBySeverity(alerts: Alert[], severity: string): number {
    return alerts.filter(alert =>
      this.getCalculatedSeverity(alert) === severity
    ).length;
  }

  openVehicleAlertForm(vehicle: Vehicle) {
    this.alertForm = this.getEmptyAlertForm();
    this.alertForm.type = 'vehicle';
    this.alertForm.vehicle_id = vehicle.id;
    this.alertForm.related_entity = 'vehicle';
    this.alertForm.related_id = vehicle.id;

    this.showAlertForm = true;
  }

  openCompleteModal(alertItem: Alert) {
  this.selectedAlertToComplete = alertItem;

  this.completeForm = {
    final_cost: alertItem.estimated_cost || null,
    notes: ''
  };

  this.showCompleteModal = true;
}

closeCompleteModal() {
  this.showCompleteModal = false;
  this.selectedAlertToComplete = null;

  this.completeForm = {
    final_cost: null,
    notes: ''
  };
}

confirmCompleteAlert() {
  if (!this.selectedAlertToComplete) {
    return;
  }

  if (
    this.completeForm.final_cost === null ||
    Number(this.completeForm.final_cost) < 0
  ) {
    alert('Debe ingresar el costo real');
    return;
  }

  this.alertService.completeAlert(
    this.selectedAlertToComplete.id,
    {
      final_cost: Number(this.completeForm.final_cost),
      notes: this.completeForm.notes || null
    }
  ).subscribe({
    next: () => {
      this.closeCompleteModal();
      this.loadAlerts();
      this.loadVehicleHistory();
    },
    error: (error) => {
      console.error('Error al completar alerta:', error);
      alert('No se pudo completar la alerta');
    }
  });
}

  openDriverAlertForm(driver: Driver) {
    this.alertForm = this.getEmptyAlertForm();
    this.alertForm.type = 'driver';
    this.alertForm.driver_id = driver.id;
    this.alertForm.related_entity = 'driver';
    this.alertForm.related_id = driver.id;
    this.alertForm.category = 'licencia';

    this.showAlertForm = true;
  }

  saveAlert() {
    if (!this.alertForm.title.trim()) {
      alert('Debe ingresar el título de la alerta');
      return;
    }

    if (!this.alertForm.due_date) {
      alert('Debe ingresar la fecha límite de la alerta');
      return;
    }

    if (!this.alertForm.category) {
      alert('Debe seleccionar una categoría');
      return;
    }

    this.alertService.createAlert(this.alertForm).subscribe({
      next: () => {
        this.showAlertForm = false;
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error al guardar alerta:', error);
        alert('No se pudo guardar la alerta');
      }
    });
  }

  completeAlert(alertItem: Alert) {
    const confirmed = confirm(
      '¿Marcar esta alerta como realizada? Si tiene costo, se registrará como gasto/historial.'
    );

    if (!confirmed) return;

  
  }

  cancelAlert(alertItem: Alert) {
    const confirmed = confirm(
      '¿Marcar esta alerta como no realizada?'
    );

    if (!confirmed) return;

    this.alertService.cancelAlert(alertItem.id).subscribe({
      next: () => {
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error al cancelar alerta:', error);
        alert('No se pudo cancelar la alerta');
      }
    });
  }

  closeAlertForm() {
    this.showAlertForm = false;
  }

  getVehicleCardTitle(vehicle: Vehicle): string {
    return vehicle.service_type === 'radio_taxi'
      ? `Móvil ${vehicle.radio_code || vehicle.plate}`
      : `Taxi ${vehicle.plate}`;
  }
}