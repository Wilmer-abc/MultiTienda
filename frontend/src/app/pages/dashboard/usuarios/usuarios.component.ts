import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface NuevoUsuario {
  tienda_id: number | null;
  nombre: string;
  correo: string;
  password: string;
  rol: 'administrador' | 'cajero';
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  currentRolLogueado: string = '';
  miTiendaId: number | null = null;

  // Modelo limpio listo para mapear a tu tabla `usuarios` de MySQL
  usuarioModel: NuevoUsuario = {
    tienda_id: null,
    nombre: '',
    correo: '',
    password: '',
    rol: 'cajero'
  };

  // Simulación de tiendas registradas en el sistema (Solo útil para el Superadmin/Dueño)
  tiendasDisponibles = [
    { id: 1, nombre: 'Sucursal Zona 14' },
    { id: 2, nombre: 'Sucursal Zona 1' },
    { id: 3, nombre: 'Sucursal Petén' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.currentRolLogueado = usuario.rol; // 'dueño' o 'administrador'
      this.miTiendaId = usuario.tienda_id;

      // REGLA DE SEGURIDAD: Si es administrador, le heredamos su tienda_id automáticamente y lo bloqueamos en su rol
      if (this.currentRolLogueado === 'administrador') {
        this.usuarioModel.tienda_id = this.miTiendaId;
        this.usuarioModel.rol = 'cajero'; // Un administrador por defecto solo puede crear cajeros
      }
    }
  }

  registrarUsuarioDB(): void {
    if (!this.usuarioModel.nombre || !this.usuarioModel.correo || !this.usuarioModel.password) {
      alert('Por favor, llena todos los campos obligatorios.');
      return;
    }

    // Si es el Dueño global, es obligatorio que elija a qué tienda mandará al nuevo empleado
    if (this.currentRolLogueado === 'dueño' && !this.usuarioModel.tienda_id) {
      alert('Como Dueño/Superadmin debes asignar una sucursal a este usuario.');
      return;
    }

    // Objeto DTO final que se mandará por HTTP POST a NestJS para el INSERT INTO usuarios
    console.log('Insertando nueva fila en tabla usuarios de MySQL:', this.usuarioModel);

    alert(`¡Felicidades! El usuario "${this.usuarioModel.nombre}" con rol de [${this.usuarioModel.rol}] ha sido creado y vinculado exitosamente a la Tienda #${this.usuarioModel.tienda_id}.`);

    // Limpiamos el formulario
    this.usuarioModel = {
      tienda_id: this.currentRolLogueado === 'administrador' ? this.miTiendaId : null,
      nombre: '',
      correo: '',
      password: '',
      rol: 'cajero'
    };
  }
}