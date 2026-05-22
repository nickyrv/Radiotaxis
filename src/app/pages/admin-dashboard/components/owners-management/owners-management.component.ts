import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  OwnerService,
  Owner,
  OwnerRequest
} from '../../../../services/owner.service';

@Component({
  selector: 'app-owners-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './owners-management.component.html',
  styleUrls: ['./owners-management.component.css']
})
export class OwnersManagementComponent implements OnInit {

  owners: Owner[] = [];

  showForm = false;

  editingOwner: Owner | null = null;

  searchTerm = '';

  ownerForm: OwnerRequest = {
    name: '',
    ci: '',
    phone: '',
    email: '',
    address: '',
    status: 'active',
    join_date: null
  };

  constructor(private ownerService: OwnerService) {}

  ngOnInit() {
    this.loadOwners();
  }

  loadOwners() {
    this.ownerService.getOwners().subscribe({
      next: (data) => {
        console.log('Owners:', data);
        this.owners = data;
      },
      error: (error) => {
        console.error('Error al cargar propietarios:', error);
      }
    });
  }

  get filteredOwners() {
    return this.owners.filter(owner =>
      owner.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (owner.email || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  handleEdit(owner: Owner) {

    this.editingOwner = owner;

    this.ownerForm = {
      name: owner.name,
      ci: owner.ci,
      phone: owner.phone,
      email: owner.email,
      address: owner.address,
      status: owner.status,
      join_date: owner.join_date
    };

    this.showForm = true;
  }

  handleDelete(id: number) {

    const confirmDelete = confirm(
      '¿Eliminar propietario?'
    );

    if (!confirmDelete) {
      return;
    }

    this.ownerService.deleteOwner(id).subscribe({
      next: () => {
        this.loadOwners();
      },
      error: (error) => {
        console.error('Error al eliminar propietario:', error);
        alert('No se pudo eliminar');
      }
    });
  }

  openNewOwnerForm() {

    this.editingOwner = null;

    this.ownerForm = {
      name: '',
      ci: '',
      phone: '',
      email: '',
      address: '',
      status: 'active',
      join_date: null
    };

    this.showForm = true;
  }

  saveOwner() {

    if (this.editingOwner) {

      this.ownerService.updateOwner(
        this.editingOwner.id,
        this.ownerForm
      ).subscribe({
        next: () => {
          this.closeModal();
          this.loadOwners();
        },
        error: (error) => {
          console.error('Error al actualizar:', error);
        }
      });

    } else {

      this.ownerService.createOwner(this.ownerForm).subscribe({
        next: () => {
          this.closeModal();
          this.loadOwners();
        },
        error: (error) => {
          console.error('Error al guardar:', error);
        }
      });

    }

  }

  closeModal() {
    this.showForm = false;
  }
}