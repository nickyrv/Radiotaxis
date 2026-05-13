import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { mockOwners, mockVehicles } from '../../../../data/mock-data';
import { Owner } from '../../../../models/owner.model';

@Component({
  selector: 'app-owners-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owners-management.component.html',
  styleUrls: ['./owners-management.component.css']
})
export class OwnersManagementComponent {

  owners = mockOwners;

  mockVehicles = mockVehicles;

  showForm = false;

  editingOwner: Owner | null = null;

  searchTerm = '';

  get filteredOwners() {
    return this.owners.filter(owner =>
      owner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      owner.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getVehiclesInfo(vehicleIds: string[]) {
    const vehicles = this.mockVehicles.filter(v =>
      vehicleIds.includes(v.id)
    );

    return vehicles.map(v => v.plate).join(', ');
  }

  handleEdit(owner: Owner) {
    this.editingOwner = owner;
    this.showForm = true;
  }

  handleDelete(id: string) {
    if (confirm('¿Eliminar propietario?')) {
      this.owners = this.owners.filter(o => o.id !== id);
    }
  }

}