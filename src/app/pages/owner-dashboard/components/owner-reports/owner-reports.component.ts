import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-owner-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owner-reports.component.html',
  styleUrls: ['./owner-reports.component.css']
})
export class OwnerReportsComponent {

  @Input() currentOwner: any = null;
  @Input() ownerVehicles: any[] = [];
  @Input() ownerPayments: any[] = [];
  @Input() ownerMaintenances: any[] = [];

  @Input() totalIncome = 0;
  @Input() totalExpenses = 0;
  @Input() netProfit = 0;

  today = new Date();

  reportPeriod: 'monthly' | 'semester' | 'annual' = 'monthly';
  reportVehicleId: number | null = null;

  get filteredPayments() {
    return this.ownerPayments.filter(payment => {
      const matchesVehicle =
        !this.reportVehicleId ||
        Number(payment.vehicle_id) === Number(this.reportVehicleId);

      return matchesVehicle && this.isWithinPeriod(payment.payment_date);
    });
  }

  get filteredMaintenances() {
    return this.ownerMaintenances.filter(item => {
      const matchesVehicle =
        !this.reportVehicleId ||
        Number(item.vehicle_id) === Number(this.reportVehicleId);

      return matchesVehicle && this.isWithinPeriod(item.event_date);
    });
  }

  get reportIncome() {
    return this.filteredPayments
      .filter(payment => payment.type === 'income' && payment.status === 'paid')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  get reportExpenses() {
    return this.filteredPayments
      .filter(payment => payment.type === 'expense' && payment.status === 'paid')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  get reportProfit() {
    return this.reportIncome - this.reportExpenses;
  }

  isWithinPeriod(dateValue: string | null): boolean {
    if (!dateValue) return false;

    const today = new Date();
    const date = new Date(dateValue + 'T00:00:00');

    if (this.reportPeriod === 'monthly') {
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }

    if (this.reportPeriod === 'semester') {
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);
      return date >= sixMonthsAgo && date <= today;
    }

    if (this.reportPeriod === 'annual') {
      return date.getFullYear() === today.getFullYear();
    }

    return true;
  }

  getPeriodLabel(): string {
    switch (this.reportPeriod) {
      case 'monthly': return 'Mensual';
      case 'semester': return 'Semestral';
      case 'annual': return 'Anual';
      default: return '';
    }
  }

  getVehicleLabel(): string {
    if (!this.reportVehicleId) return 'General';

    const vehicle = this.ownerVehicles.find(item =>
      Number(item.id) === Number(this.reportVehicleId)
    );

    return vehicle ? `${vehicle.plate} - ${vehicle.model}` : 'Vehículo';
  }

  generatePdf() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Reporte Financiero del Propietario', 14, 15);

    doc.setFontSize(10);
    doc.text(`Propietario: ${this.currentOwner?.name || 'Propietario'}`, 14, 25);
    doc.text(`Periodo: ${this.getPeriodLabel()}`, 14, 31);
    doc.text(`Vehículo: ${this.getVehicleLabel()}`, 14, 37);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 43);

    doc.setFontSize(12);
    doc.text(`Ingresos: Bs. ${this.reportIncome}`, 14, 55);
    doc.text(`Gastos: Bs. ${this.reportExpenses}`, 14, 63);
    doc.text(`Utilidad: Bs. ${this.reportProfit}`, 14, 71);

    autoTable(doc, {
      startY: 82,
      head: [['Fecha', 'Concepto', 'Tipo', 'Monto']],
      body: this.filteredPayments.map(payment => [
        payment.payment_date,
        payment.concept,
        payment.type === 'income' ? 'Ingreso' : 'Gasto',
        `Bs. ${payment.amount}`
      ])
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 12,
      head: [['Fecha', 'Categoría', 'Detalle', 'Costo']],
      body: this.filteredMaintenances.map(item => [
        item.event_date,
        item.category || 'Mantenimiento',
        item.detail || item.description || 'Sin detalle',
        `Bs. ${item.cost}`
      ])
    });

    const fileName = `Reporte_${this.getPeriodLabel()}_${this.getVehicleLabel()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')}.pdf`;

    doc.save(fileName);
  }
}