import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  AlertService,
  Alert
} from '../../../../services/alert.service';

@Component({
  selector: 'app-alerts-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-management.component.html',
  styleUrls: ['./alerts-management.component.css']
})
export class AlertsManagementComponent implements OnInit {

  alerts: Alert[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.loadAlerts();
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

  get highAlerts() {
    return this.alerts.filter(a => a.severity === 'high').length;
  }

  get mediumAlerts() {
    return this.alerts.filter(a => a.severity === 'medium').length;
  }

  get documentAlerts() {
    return this.alerts.filter(a => a.type === 'document').length;
  }

  resolveAlert(id: number) {
    this.alertService.resolveAlert(id).subscribe({
      next: () => {
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error al resolver alerta:', error);
      }
    });
  }

  getSeverityColor(severity: string) {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  }

  getSeverityBadge(severity: string) {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  getSeverityLabel(severity: string) {
    switch (severity) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Media';
      case 'low':
        return 'Baja';
      default:
        return severity;
    }
  }

  getTypeLabel(type: string) {
    switch (type) {
      case 'document':
        return 'Documentación';
      case 'maintenance':
        return 'Mantenimiento';
      case 'payment':
        return 'Pago';
      case 'incident':
        return 'Incidente';
      case 'shift':
        return 'Relevo';
      default:
        return type;
    }
  }

  getStatusLabel(status: string) {
    return status === 'resolved' ? 'Resuelta' : 'Pendiente';
  }
}