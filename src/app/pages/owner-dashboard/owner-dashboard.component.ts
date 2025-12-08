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

  user = { id: '2', name: 'Juan Propietario', role: 'owner' };
  sidebarOpen = false;

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
    }
  ];

  totalThisMonth = 5000;
  totalMaintenanceCosts = 1200;
  netProfit = this.totalThisMonth - this.totalMaintenanceCosts;

  logout() {
    alert('Sesión cerrada');
  }
}
