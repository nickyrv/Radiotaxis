import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent {

  sidebarOpen = false;

  user = {
    id: '2',
    name: 'Juan Propietario',
    role: 'owner'
  };

  ownerVehicles = [
    {
      id: 'v1',
      plate: 'ABC-123',
      model: 'Toyota Corolla',
      year: 2020,
      status: 'active',
      lastMaintenance: '2025-11-01',
      nextMaintenance: '2025-12-01',
      documentExpiry: '2026-05-01',
      ownerId: '2'
    },
    {
      id: 'v2',
      plate: 'XYZ-777',
      model: 'Suzuki Dzire',
      year: 2022,
      status: 'maintenance',
      lastMaintenance: '2025-10-15',
      nextMaintenance: '2025-11-20',
      documentExpiry: '2026-03-10',
      ownerId: '2'
    }
  ];

  vehicleIds = this.ownerVehicles.map(v => v.id);

  ownerPayments = [
    {
      id: 'p1',
      vehicleId: 'v1',
      concept: 'Pago semanal',
      amount: 1500,
      date: '2026-05-10'
    },
    {
      id: 'p2',
      vehicleId: 'v2',
      concept: 'Pago diario',
      amount: 800,
      date: '2026-05-11'
    }
  ];

  ownerMaintenances = [
    {
      id: 'm1',
      vehicleId: 'v1',
      type: 'Cambio de aceite',
      description: 'Mantenimiento preventivo',
      cost: 300,
      date: '2026-05-01'
    },
    {
      id: 'm2',
      vehicleId: 'v2',
      type: 'Frenos',
      description: 'Cambio de pastillas',
      cost: 900,
      date: '2026-05-03'
    }
  ];

  totalThisMonth = this.ownerPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  totalMaintenanceCosts = this.ownerMaintenances.reduce(
    (sum, m) => sum + m.cost,
    0
  );

  netProfit =
    this.totalThisMonth - this.totalMaintenanceCosts;

  logout() {
    alert('Sesión cerrada');
  }

}