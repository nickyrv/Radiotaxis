import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
  mockProfitabilityData,
  mockDailyEarnings,
  mockVehicles,
  mockDrivers,
  mockAlerts
} from '../../../../data/mock-data';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-overview.component.html',
  styleUrls: ['./admin-overview.component.css']
})
export class AdminOverviewComponent {

  activeVehicles = mockVehicles.filter(
    v => v.status === 'active'
  ).length;

  activeDrivers = mockDrivers.filter(
    d => d.status === 'active'
  ).length;

  highAlerts = mockAlerts.filter(
    a => a.severity === 'high'
  ).length;

  currentMonth = mockProfitabilityData[5].historical;

  previousMonth = mockProfitabilityData[4].historical;

  growth = (
    ((this.currentMonth - this.previousMonth)
    / this.previousMonth) * 100
  ).toFixed(1);

  alerts = mockAlerts;

  lineChartData = {
    labels: mockProfitabilityData.map(d => d.month),
    datasets: [
      {
        data: mockProfitabilityData.map(d => d.historical),
        label: 'Histórico'
      },
      {
        data: mockProfitabilityData.map(d => d.predicted),
        label: 'Predicción IA'
      }
    ]
  };

  barChartData = {
    labels: mockDailyEarnings.map(d => d.day),
    datasets: [
      {
        data: mockDailyEarnings.map(d => d.amount),
        label: 'Ingresos'
      }
    ]
  };

}