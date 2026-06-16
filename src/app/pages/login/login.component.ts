import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AuthService,
  LoginResponse
} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';
  showPassword = false;
  loginMessage = '';
  failedAttempts = 0;
  maxAttempts = 3;
  isBlocked = false;
  showNotification = false;
  notificationTitle = '';
  notificationMessage = '';
  notificationType: 'success' | 'error' | 'warning' = 'error';
  showForgotPassword = false;
  recoveryEmail = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {

    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {

      try {

        const user = JSON.parse(savedUser);

        if (user.role === 'admin') {
          this.router.navigate(
            ['/admin-dashboard'],
            { replaceUrl: true }
          );
          return;
        }

        if (user.role === 'owner') {
          this.router.navigate(
            ['/owner-dashboard'],
            { replaceUrl: true }
          );
          return;
        }

        if (user.role === 'driver') {
          this.router.navigate(
            ['/driver-dashboard'],
            { replaceUrl: true }
          );
          return;
        }

      } catch {
        localStorage.removeItem('currentUser');
      }

    }

    const savedAttempts = localStorage.getItem('failedAttempts');
    const savedBlocked = localStorage.getItem('isBlocked');

    if (savedAttempts) {
      this.failedAttempts = Number(savedAttempts);
    }

    if (savedBlocked === 'true') {
      this.isBlocked = true;
      this.loginMessage = 'Acceso bloqueado';
    }

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

  

  openForgotPassword() {
    this.recoveryEmail = this.email;
    this.showForgotPassword = true;
  }

 sendRecoveryEmail() {

  if (!this.recoveryEmail) {
    this.showLoginNotification(
      'Correo requerido',
      'Debe ingresar su correo para recuperar la contraseña.',
      'warning'
    );
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(this.recoveryEmail)) {
    this.showLoginNotification(
      'Correo inválido',
      'Debe ingresar un correo válido.',
      'warning'
    );
    return;
  }

  this.authService.forgotPassword(this.recoveryEmail).subscribe({

    next: () => {

      this.showForgotPassword = false;

      // DESBLOQUEAR LOGIN

      this.failedAttempts = 0;
      this.isBlocked = false;

      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('isBlocked');

      this.showLoginNotification(
        'Acceso desbloqueado',
        'Se enviaron instrucciones al correo registrado. Ya puede intentar ingresar nuevamente.',
        'success'
      );
    },

    error: () => {

      this.showLoginNotification(
        'Correo no registrado',
        'No existe una cuenta asociada a ese correo.',
        'error'
      );
    }

  });

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.email)) {
      this.showLoginNotification(
        'Correo inválido',
        'Debe ingresar un correo válido, por ejemplo: usuario@radiotaxi.com',
        'warning'
      );
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (user: LoginResponse) => {

        this.failedAttempts = 0;
        this.isBlocked = false;

        localStorage.removeItem('failedAttempts');
        localStorage.removeItem('isBlocked');

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
            this.router.navigate(['/admin-dashboard'], { replaceUrl: true });
          }

          if (user.role === 'owner') {
            this.router.navigate(['/owner-dashboard'], { replaceUrl: true });
          }

          if (user.role === 'driver') {
            this.router.navigate(['/driver-dashboard'], { replaceUrl: true });
          }
        }, 800);

      },
      error: () => {

        this.failedAttempts++;

        localStorage.setItem(
          'failedAttempts',
          this.failedAttempts.toString()
        );

        const remainingAttempts =
          this.maxAttempts - this.failedAttempts;

        if (this.failedAttempts >= this.maxAttempts) {
          this.isBlocked = true;

          localStorage.setItem('isBlocked', 'true');

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