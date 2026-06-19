import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  UserService,
  UserProfile
} from '../../services/user.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  user: UserProfile | null = null;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');

    if (!savedUser) {
      return;
    }

    const currentUser = JSON.parse(savedUser);

    this.userService.getUser(currentUser.id).subscribe({
      next: (user) => {
        this.user = user;

        localStorage.setItem(
          'currentUser',
          JSON.stringify(user)
        );
      },
      error: () => {
        this.user = currentUser;
      }
    });
  }

  getRoleLabel(role: string): string {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'driver':
        return 'Conductor';
      case 'owner':
        return 'Propietario';
      default:
        return role || 'Sin rol';
    }
  }

  getInitials(): string {
    if (!this.user?.name) {
      return 'U';
    }

    return this.user.name
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  onProfilePhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0 || !this.user) {
      return;
    }

    const file = input.files[0];

    this.userService.uploadUserPhoto(
      this.user.id,
      file
    ).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;

        localStorage.setItem(
          'currentUser',
          JSON.stringify(updatedUser)
        );
      },
      error: (error) => {
        console.error('Error al subir foto:', error);
        alert('No se pudo subir la foto de perfil');
      }
    });
  }

  goBack() {
    if (this.user?.role === 'admin') {
      this.router.navigate(['/admin-dashboard']);
      return;
    }

    if (this.user?.role === 'owner') {
      this.router.navigate(['/owner-dashboard']);
      return;
    }

    if (this.user?.role === 'driver') {
      this.router.navigate(['/driver-dashboard']);
      return;
    }

    this.router.navigate(['/login']);
  }
}