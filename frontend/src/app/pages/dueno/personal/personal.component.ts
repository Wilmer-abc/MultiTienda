import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  sucursal: string;
}

@Component({
  selector: 'app-personal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent {
  usuarios: Usuario[] = [
    { id: '1', nombre: 'Juan Pérez', email: 'juan@elahorro.com', rol: 'CAJERO', sucursal: 'Zona 14' },
    { id: '2', nombre: 'María García', email: 'maria@elahorro.com', rol: 'CAJERO', sucursal: 'Zona 10' }
  ];

  formData = {
    nombre: '',
    email: '',
    rol: 'CAJERO',
    sucursal: 'Zona 14'
  };

  roles: string[] = ['CAJERO', 'DUENO'];
  sucursales: string[] = ['Zona 14', 'Zona 10'];

  mostrandoFormulario: boolean = false;

  onSubmit(): void {
    const nuevoUsuario: Usuario = {
      id: Date.now().toString(),
      nombre: this.formData.nombre,
      email: this.formData.email,
      rol: this.formData.rol,
      sucursal: this.formData.sucursal
    };

    this.usuarios.push(nuevoUsuario);
    this.mostrandoFormulario = false;
    this.resetForm();
  }

  toggleFormulario(): void {
    this.mostrandoFormulario = !this.mostrandoFormulario;
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      email: '',
      rol: 'CAJERO',
      sucursal: 'Zona 14'
    };
  }
}
