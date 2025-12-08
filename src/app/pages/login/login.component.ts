import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Importante

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
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  selectedRole: UserRole = 'admin';

  demoUsers: User[] = [
    { id: '1', name: 'Carlos Administrador', role: 'admin' },
    { id: '2', name: 'Juan Propietario', role: 'owner', vehicleId: 'ABC-123' },
    { id: '3', name: 'María Conductora', role: 'driver', vehicleId: 'ABC-123' },
  ];

  constructor(private router: Router) {}

  selectRole(role: UserRole) {
    this.selectedRole = role;
  }

  loginUser() {
    const user = this.demoUsers.find(u => u.role === this.selectedRole);
    if (user) {
      console.log('Usuario logueado:', user);

      // Redirección por rol
      if (user.role === 'admin') this.router.navigate(['/perfil-usuario']);
      if (user.role === 'owner') this.router.navigate(['/owner-dashboard']);
      if (user.role === 'driver') this.router.navigate(['/perfil-usuario']);
    }
  }
}
