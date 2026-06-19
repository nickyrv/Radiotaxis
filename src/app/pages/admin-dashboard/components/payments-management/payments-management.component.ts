import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  PaymentService,
  Payment,
  PaymentRequest
} from '../../../../services/payment.service';

import {
  DriverService,
  Driver
} from '../../../../services/driver.service';

import {
  VehicleService,
  Vehicle
} from '../../../../services/vehicle.service';

import {
  TripService,
  Trip
} from '../../../../services/trip.service';

import {
  ShiftDayService,
  ShiftDay
} from '../../../../services/shift-day.service';

import {
  VehicleHistoryService,
  VehicleHistory
} from '../../../../services/vehicle-history.service';



@Component({
  selector: 'app-payments-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments-management.component.html',
  styleUrls: ['./payments-management.component.css']
})
export class PaymentsManagementComponent implements OnInit {

  payments: Payment[] = [];

  drivers: Driver[] = [];

  vehicles: Vehicle[] = [];

  showForm = false;
  filterVehicleId: number | null = null;
  filterDriverId: number | null = null;
  filterServiceType: 'all' | 'radio_taxi' | 'taxi' = 'all';
  filterStartDate = '';
  filterEndDate = '';

  editingPayment: Payment | null = null;

  searchTerm = '';
  activeFinanceTab: 'rentas' | 'gastos' | 'balance' = 'rentas';
  financeVehicleFilter: number | null = null;

  financePeriodFilter:
    'all' | 'week' | 'month' | 'year' = 'all';
  paymentDayIncidents: VehicleHistory[] = [];
  shiftDays: ShiftDay[] = [];
  vehicleHistory: VehicleHistory[] = [];

  paymentForm: PaymentRequest = {

    driver_id: null,

    vehicle_id: null,

    trip_id: null,

    amount: 0,

    type: 'income',
    concept: 'Renta diaria',

    payment_date: '',

    status: 'paid',

    observations: ''
  };

  expenseCategories = [
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'fuel', label: 'Combustible' },
    { value: 'tires', label: 'Llantas' },
    { value: 'repair', label: 'Reparación' },
    { value: 'accident', label: 'Accidente' },
    { value: 'documents', label: 'Documentación' },
    { value: 'other', label: 'Otro' }
  ];

  constructor(
    private paymentService: PaymentService,
    private driverService: DriverService,
    private vehicleService: VehicleService,
    private tripService: TripService,
    private shiftDayService: ShiftDayService,
private vehicleHistoryService: VehicleHistoryService
  ) {}

  ngOnInit() {

    this.loadPayments();

    this.loadDrivers();

    this.loadVehicles();

    this.loadShiftDays();

    this.loadVehicleHistory();
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

  loadDrivers() {

    this.driverService.getDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
      }
    });
  }

  loadShiftDays() {
  this.shiftDayService.getShiftDays().subscribe({
    next: (data) => {
      this.shiftDays = data;
    }
  });
}

loadVehicleHistory() {
  this.vehicleHistoryService.getAllHistory().subscribe({
    next: (data) => {
      this.vehicleHistory = data;
    }
  });
}

setFinanceTab(tab: 'rentas' | 'gastos' | 'balance') {
  this.activeFinanceTab = tab;
}

  loadVehicles() {

    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
      }
    });
  }



  get filteredPayments() {

    return this.payments.filter(payment =>

      payment.concept.toLowerCase().includes(
        this.searchTerm.toLowerCase()
      )
    );
  }

  getDriverName(driverId: number | null): string {

    if (!driverId) {
      return 'N/A';
    }

    return (
      this.drivers.find(
        d => d.id === driverId
      )?.name || 'N/A'
    );
  }

  get incomePayments() {
    return this.payments.filter(payment =>
      payment.type === 'income'
    );
  }

  get expensePayments() {
    return this.payments.filter(payment =>
      payment.type === 'expense'
    );
  }

  get totalIncome() {
    return this.incomePayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
  }

  get totalExpenses() {
    return this.expensePayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
  }

  get balanceTotal() {
    return this.totalIncome - this.totalExpenses;
  }

  getVehiclePlate(vehicleId: number | null): string {

    if (!vehicleId) {
      return 'N/A';
    }

    return (
      this.vehicles.find(
        v => v.id === vehicleId
      )?.plate || 'N/A'
    );
  }

  matchesTableFilters(row: any): boolean {
    const vehicle = this.vehicles.find(v =>
      Number(v.id) === Number(row.vehicle_id)
    );

    const matchesVehicle =
      !this.filterVehicleId ||
      Number(row.vehicle_id) === Number(this.filterVehicleId);

    const matchesDriver =
      !this.filterDriverId ||
      Number(row.driver_id) === Number(this.filterDriverId);

    const matchesServiceType =
      this.filterServiceType === 'all' ||
      vehicle?.service_type === this.filterServiceType;

    const matchesStart =
      !this.filterStartDate ||
      row.date >= this.filterStartDate;

    const matchesEnd =
      !this.filterEndDate ||
      row.date <= this.filterEndDate;

    return (
      matchesVehicle &&
      matchesDriver &&
      matchesServiceType &&
      matchesStart &&
      matchesEnd
    );
  }

  openNewPaymentForm() {

    this.editingPayment = null;

    this.paymentForm = {

      driver_id: null,

      vehicle_id: null,

      trip_id: null,

      amount: 0,

      type: 'income',
      concept: 'Renta diaria',

      payment_date: '',

      status: 'paid',

      observations: ''
    };

    this.showForm = true;
  }

  handleEdit(payment: Payment) {

    this.editingPayment = payment;

    this.paymentForm = {

      driver_id: payment.driver_id,

      vehicle_id: payment.vehicle_id,

      trip_id: payment.trip_id,

      amount: payment.amount,

      type: payment.type,

      concept: payment.concept,

      payment_date: payment.payment_date,

      status: payment.status,

      observations: payment.observations
    };

    this.assignPaymentDriverByDateAndVehicle();

    this.showForm = true;
  }

  onPaymentTypeChange() {
    if (this.paymentForm.type === 'income') {
      this.paymentForm.concept = 'Renta diaria';
    }

    if (this.paymentForm.type === 'expense') {
      this.paymentForm.concept = '';
      this.paymentForm.driver_id = null;
    }
  }

  assignPaymentDriverByDateAndVehicle() {

    this.paymentDayIncidents = [];

    if (!this.paymentForm.vehicle_id || !this.paymentForm.payment_date) {
      this.paymentForm.driver_id = null;
      return;
    }

    const shiftDay = this.shiftDays.find(day =>
      Number(day.vehicle_id) === Number(this.paymentForm.vehicle_id) &&
      day.shift_date === this.paymentForm.payment_date
    );

    this.paymentForm.driver_id = shiftDay?.driver_id || null;

    this.paymentDayIncidents = this.vehicleHistory.filter(history =>
      Number(history.vehicle_id) === Number(this.paymentForm.vehicle_id) &&
      history.event_date === this.paymentForm.payment_date &&
      (
        (history.category || '').toLowerCase().includes('accidente') ||
        (history.category || '').toLowerCase().includes('falla')
      )
    );
  }

  

  savePayment() {

    this.paymentForm.trip_id = null;

    if (!this.paymentForm.vehicle_id) {
      alert('Debe seleccionar un vehículo');
      return;
    }

    if (!this.paymentForm.payment_date) {
      alert('Debe seleccionar la fecha del pago');
      return;
    }

    if (this.paymentForm.type === 'income' && !this.paymentForm.driver_id) {
      alert('No existe conductor programado para ese vehículo en la fecha seleccionada');
      return;
    }

    if (this.paymentForm.type === 'expense' && !this.paymentForm.concept) {
      alert('Debe seleccionar una categoría de gasto');
      return;
    }

    if (!this.paymentForm.amount || this.paymentForm.amount <= 0) {
      alert('Debe ingresar un monto válido');
      return;
    }

    if (this.editingPayment) {

      this.paymentService.updatePayment(
        this.editingPayment.id,
        this.paymentForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadPayments();
        },
        error: (error) => {
          console.error('Error al actualizar pago:', error);
        }
      });

    } else {

      this.paymentService.createPayment(
        this.paymentForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadPayments();
        },
        error: (error) => {
          console.error('Error al guardar pago:', error);
        }
      });

    }
  }

  handleDelete(id: number) {

    const confirmed = confirm(
      '¿Eliminar pago?'
    );

    if (!confirmed) {
      return;
    }

    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.loadPayments();
      },
      error: (error) => {
        console.error(
          'Error al eliminar pago:',
          error
        );
      }
    });
  }

  selectedBalanceVehicleId: number | null = null;

  get balancePayments() {
    if (!this.selectedBalanceVehicleId) {
      return this.payments;
    }

    return this.payments.filter(payment =>
      Number(payment.vehicle_id) === Number(this.selectedBalanceVehicleId)
    );
  }

  get balanceIncome() {
    return this.balancePayments
      .filter(payment => payment.type === 'income')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  isCompletedHistoryExpense(history: VehicleHistory): boolean {
    return (
      history.maintenance_status === 'completed' &&
      history.cost !== null &&
      history.cost !== undefined &&
      Number(history.cost) > 0
    );
  }

  get balanceExpenses() {
    const paymentExpenses = this.balancePayments
      .filter(payment =>
        payment.type === 'expense' &&
        this.matchesFinanceFilters(
          payment.vehicle_id,
          payment.payment_date
        )
      )
      .reduce(
        (sum, payment) => sum + Number(payment.amount || 0),
        0
      );

    const historyExpenses = this.vehicleHistory
      .filter(history => {
        const matchesVehicle =
          !this.selectedBalanceVehicleId ||
          Number(history.vehicle_id) === Number(this.selectedBalanceVehicleId);

        const hasCost =
          history.cost !== null &&
          history.cost !== undefined &&
          Number(history.cost) > 0;

        const isPastOrToday =
          this.isDateUntilToday(history.event_date);

        const matchesFilters =
          this.matchesFinanceFilters(
            history.vehicle_id,
            history.event_date
          );

        return (
          matchesVehicle &&
          this.isCompletedHistoryExpense(history) &&
          isPastOrToday &&
          matchesFilters
        );
      })
      .reduce(
        (sum, history) => sum + Number(history.cost || 0),
        0
      );

    return paymentExpenses + historyExpenses;
  }

  get incomeRows() {
    return this.incomePayments
      .map(payment => ({
        id: payment.id,
        date: payment.payment_date,
        concept: payment.concept,
        driver_id: payment.driver_id,
        vehicle_id: payment.vehicle_id,
        amount: payment.amount,
        status: payment.status,
        source: 'finanzas',
        observation: 'Renta registrada en Finanzas'
      }))
      .filter(row => this.matchesTableFilters(row));
  }

  handleEditById(paymentId: number) {
    const payment = this.payments.find(item =>
      Number(item.id) === Number(paymentId)
    );

    if (!payment) {
      alert('No se puede editar este registro desde Finanzas');
      return;
    }

    this.handleEdit(payment);
  }

  isDateUntilToday(dateValue: string | null | undefined): boolean {
    if (!dateValue) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateValue + 'T00:00:00');
    date.setHours(0, 0, 0, 0);

    return date <= today;
  }
  
  handleFinanceRowEdit(row: any) {
    if (row.source === 'finanzas') {
      this.handleEditById(row.id);
      return;
    }

    if (row.source === 'historial') {
      alert(
        'Este gasto pertenece al historial del vehículo. Para editarlo, ingrese a la pestaña Vehículos > Mantenimiento.'
      );
      return;
    }
  }

  handleFinanceRowDelete(row: any) {
    if (row.source === 'finanzas') {
      this.handleDelete(row.id);
      return;
    }

    if (row.source === 'historial') {
      const confirmed = confirm(
        'Este gasto viene del historial de mantenimiento del vehículo. ¿Desea eliminar este registro?'
      );

      if (!confirmed) {
        return;
      }

      this.vehicleHistoryService.deleteHistory(row.id).subscribe({
        next: () => {
          this.loadVehicleHistory();
        },
        error: (error) => {
          console.error('Error al eliminar historial:', error);
          alert('No se pudo eliminar el registro del historial');
        }
      });
    }
  }

  get expenseRows() {
    const manualExpenses = this.expensePayments.map(payment => ({
      id: payment.id,
      date: payment.payment_date,
      concept: payment.concept,
      driver_id: payment.driver_id,
      vehicle_id: payment.vehicle_id,
      amount: payment.amount,
      status: payment.status,
      source: 'finanzas',
      observation: 'Gasto registrado en Finanzas'
    }));

    const historyExpenses = this.vehicleHistory
      .filter(history =>
        this.isCompletedHistoryExpense(history) &&
        this.isDateUntilToday(history.event_date)
      )
      .map(history => ({
        id: history.id,
        date: history.event_date,
        concept: history.category || history.detail || 'Gasto vehicular',
        driver_id: history.driver_id || null,
        vehicle_id: history.vehicle_id,
        amount: Number(history.cost || 0),
        status: 'paid',
        source: 'historial',
        observation: 'Gasto realizado desde Vehículos > Mantenimiento'
      }));

    return [...manualExpenses, ...historyExpenses]
      .filter(row => this.matchesTableFilters(row))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  isWithinFinancePeriod(dateValue: string): boolean {

    if (this.financePeriodFilter === 'all') {
      return true;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const date = new Date(dateValue + 'T00:00:00');
    date.setHours(0, 0, 0, 0);

    if (this.financePeriodFilter === 'week') {

      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      return date >= sevenDaysAgo &&
            date <= today;
    }

    if (this.financePeriodFilter === 'month') {

      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    if (this.financePeriodFilter === 'year') {

      return (
        date.getFullYear() === today.getFullYear()
      );
    }

    return true;
  }

  get vehicleBalanceTotal() {
    return this.balanceIncome - this.balanceExpenses;
  }

  closeModal() {
    this.showForm = false;
  }

  getStatusColor(status: string) {

    switch (status) {

      case 'paid':
        return 'bg-green-100 text-green-700';

      case 'pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'cancelled':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getStatusLabel(status: string) {

    switch (status) {

      case 'paid':
        return 'Pagado';

      case 'pending':
        return 'Pendiente';

      case 'cancelled':
        return 'Cancelado';

      default:
        return status;
    }
  }

  getPaymentTypeLabel(type: string): string {

    switch (type) {

      case 'income':
        return 'Ingreso';

      case 'expense':
        return 'Gasto';

      default:
        return type;
    }
  }
  matchesFinanceFilters(
  vehicleId: number | null,
  dateValue: string
): boolean {

  const matchesVehicle =
    !this.financeVehicleFilter ||
    Number(vehicleId) === Number(this.financeVehicleFilter);

  const matchesPeriod =
    this.isWithinFinancePeriod(dateValue);

  return matchesVehicle && matchesPeriod;
}
}