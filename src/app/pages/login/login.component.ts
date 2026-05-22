import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type UserRole = 'admin' | 'owner' | 'driver';

interface User {
  id: string;
  name: string;
  role: UserRole;
  vehicleId?: string;
}

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

  demoUsers: User[] = [
    { id: '1', name: 'Carlos Administrador', role: 'admin' },
    { id: '2', name: 'Juan Propietario', role: 'owner', vehicleId: 'ABC-123' },
    { id: '3', name: 'María Conductora', role: 'driver', vehicleId: 'ABC-123' },
  ];

  constructor(private router: Router) {}

  selectRole(role: UserRole) {
    this.selectedRole = role;
    this.loginMessage = '';
  }

  loginUser() {

    const validCredentials =
      this.email === 'admin@radiotaxi.com' &&
      this.password === '123456';

    if (!validCredentials) {
      this.loginMessage = 'Credenciales incorrectas';
      alert('Credenciales incorrectas');
      return;
    }

    this.loginMessage = 'Acceso concedido';

    alert('Acceso concedido');

    const user = this.demoUsers.find(u => u.role === this.selectedRole);

    if (user) {
      console.log('Usuario logueado:', user);

      if (user.role === 'admin') this.router.navigate(['/admin-dashboard']);
      if (user.role === 'owner') this.router.navigate(['/owner-dashboard']);
      if (user.role === 'driver') this.router.navigate(['/driver-dashboard']);
    }
  }
}