import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AuthService,
  LoginResponse
} from '../../services/auth.service';

type UserRole = 'admin' | 'owner' | 'driver';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  selectedRole: UserRole = 'admin';

  email = '';
  password = '';

  loginMessage = '';

  failedAttempts = 0;
  maxAttempts = 3;
  isBlocked = false;

  showNotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'warning' = 'error';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  selectRole(role: UserRole) {
    if (this.isBlocked) return;

    this.selectedRole = role;
    this.loginMessage = '';
  }

  showLoginNotification(
    title: string,
    message: string,
    type: 'success' | 'error' | 'warning'
  ) {
    this.notificationTitle = title;
    this.notificationMessage = message;
    this.notificationType = type;
    this.showNotification = true;
  }

  loginUser() {

    if (this.isBlocked) {
      this.showLoginNotification(
        'Acceso bloqueado',
        'Superaste los 3 intentos permitidos. Comunícate con administración.',
        'error'
      );
      return;
    }

    if (!this.email || !this.password) {
      this.showLoginNotification(
        'Campos incompletos',
        'Debe ingresar correo y contraseña.',
        'warning'
      );
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password,
      role: this.selectedRole
    }).subscribe({
      next: (user: LoginResponse) => {

        this.failedAttempts = 0;

        localStorage.setItem(
          'currentUser',
          JSON.stringify(user)
        );

        this.loginMessage = 'Acceso concedido';

        this.showLoginNotification(
          'Acceso concedido',
          'Bienvenido al sistema.',
          'success'
        );

        setTimeout(() => {
          this.showNotification = false;

          if (user.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          }

          if (user.role === 'owner') {
            this.router.navigate(['/owner-dashboard']);
          }

          if (user.role === 'driver') {
            this.router.navigate(['/driver-dashboard']);
          }
        }, 800);

      },
      error: () => {

        this.failedAttempts++;

        const remainingAttempts =
          this.maxAttempts - this.failedAttempts;

        if (this.failedAttempts >= this.maxAttempts) {
          this.isBlocked = true;

          this.loginMessage = 'Acceso bloqueado';

          this.showLoginNotification(
            'Acceso bloqueado',
            'Superaste los 3 intentos permitidos. Comunícate con administración.',
            'error'
          );

          return;
        }

        this.loginMessage = 'Credenciales incorrectas';

        this.showLoginNotification(
          'Usuario o contraseña incorrectos',
          `Intento fallido. Te quedan ${remainingAttempts} intento(s).`,
          'warning'
        );
      }
    });

  }
}