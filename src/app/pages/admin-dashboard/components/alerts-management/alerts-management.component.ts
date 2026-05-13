import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { mockAlerts } from '../../../../data/mock-data';

@Component({
  selector: 'app-alerts-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-management.component.html',
  styleUrls: ['./alerts-management.component.css']
})
export class AlertsManagementComponent {

  alerts = mockAlerts;

    highAlerts = this.alerts.filter(
    a => a.severity === 'high'
  ).length;

  mediumAlerts = this.alerts.filter(
    a => a.severity === 'medium'
  ).length;

  documentAlerts = this.alerts.filter(
    a => a.type === 'document'
  ).length;

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

      default:
        return type;
    }
  }
}