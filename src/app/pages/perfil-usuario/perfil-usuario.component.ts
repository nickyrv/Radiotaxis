import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {

  user: any = null;

  ngOnInit() {
    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
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
        return role;
    }
  }
}