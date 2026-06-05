import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credenciales = {
    correo: '',
    password: ''
  };

  errorMensaje: string | null = null;
  cargando = false;
  mostrarPassword = false;
  erroresValidacion = {
    correo: '',
    password: ''
  };
  
  touched = {
    correo: false,
    password: false
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ejecutarLogin(): void {
    // Marcar todos los campos como tocados
    this.touched.correo = true;
    this.touched.password = true;
    
    // Validar campos antes de enviar
    if (!this.validarCampos()) {
      return;
    }

    this.cargando = true;
    this.errorMensaje = null;
    this.limpiarErroresValidacion();

    // Usar el servicio de autenticación con Mock Data
    const result = this.authService.login(this.credenciales.correo, this.credenciales.password);
    
    this.cargando = false;

    if (result.success && result.user) {
      console.log('Login exitoso:', result.user);
      
      // Redirección basada en el rol
      const rol = result.user.role;
      
      if (rol === 'SUPERADMIN') {
        this.router.navigate(['/superadmin']);
      } else if (rol === 'CAJERO') {
        this.router.navigate(['/cajero']);
      } else if (rol === 'DUENO') {
        this.router.navigate(['/dueno']);
      }
    } else {
      this.errorMensaje = result.error || 'Credenciales inválidas';
      this.erroresValidacion.password = 'Credenciales incorrectas';
    }
  }

  // Método para validar campos en tiempo real
  validarCampos(): boolean {
    let esValido = true;
    
    // Validar email
    if (!this.credenciales.correo) {
      this.erroresValidacion.correo = 'El correo electrónico es requerido';
      esValido = false;
    } else if (!this.validarEmail(this.credenciales.correo)) {
      this.erroresValidacion.correo = 'Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)';
      esValido = false;
    } else {
      this.erroresValidacion.correo = '';
    }
    
    // Validar password
    if (!this.credenciales.password) {
      this.erroresValidacion.password = 'La contraseña es requerida';
      esValido = false;
    } else if (this.credenciales.password.length < 6) {
      this.erroresValidacion.password = 'La contraseña debe tener al menos 6 caracteres';
      esValido = false;
    } else {
      this.erroresValidacion.password = '';
    }
    
    return esValido;
  }
  
  // Validar formato de email
  validarEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  
  // Manejar errores del servidor
  manejarErrorServidor(err: any): void {
    const status = err.status;
    const mensaje = typeof err.error?.message === 'object' 
                ? err.error?.message[0] 
                : (err.error?.message || '');

    console.log('Mensaje crudo extraído del backend:', mensaje);
    
    switch (status) {
      case 401:
        if (mensaje.includes('contraseña') || mensaje.includes('password')) {
          this.errorMensaje = 'Contraseña incorrecta. Por favor, verifica tu contraseña.';
          this.erroresValidacion.password = 'Contraseña incorrecta';
        } else if (mensaje.includes('correo') || mensaje.includes('email')) {
          this.errorMensaje = 'Correo electrónico no registrado. Verifica tu correo.';
          this.erroresValidacion.correo = 'Correo no registrado';
        } else {
          this.errorMensaje = 'Credenciales inválidas. Por favor, verifica tus datos.';
        }
        break;
      case 403:
        this.errorMensaje = 'Acceso denegado. Tu cuenta no tiene permisos suficientes.';
        break;
      case 404:
        this.errorMensaje = 'Usuario no encontrado. ¿Estás registrado?';
        this.erroresValidacion.correo = 'Usuario no encontrado';
        break;
      case 500:
        this.errorMensaje = 'Error del servidor. Por favor, intenta más tarde.';
        break;
      default:
        this.errorMensaje = mensaje || 'Error al conectar con el servidor. Verifica tu conexión.';
    }
  }
  
  // Validar en tiempo real mientras el usuario escribe
  validarCampo(campo: string): void {
    if (campo === 'correo') {
      if (!this.credenciales.correo) {
        this.erroresValidacion.correo = 'El correo electrónico es requerido';
      } else if (!this.validarEmail(this.credenciales.correo)) {
        this.erroresValidacion.correo = 'Formato de correo inválido';
      } else {
        this.erroresValidacion.correo = '';
      }
    } else if (campo === 'password') {
      if (!this.credenciales.password) {
        this.erroresValidacion.password = 'La contraseña es requerida';
      } else if (this.credenciales.password.length < 6) {
        this.erroresValidacion.password = 'Mínimo 6 caracteres';
      } else {
        this.erroresValidacion.password = '';
      }
    }
  }
  
  // Limpiar errores de validación
  limpiarErroresValidacion(): void {
    this.erroresValidacion = {
      correo: '',
      password: ''
    };
  }
  
  // Marcar campo como tocado
  marcarTocado(campo: string): void {
    if (campo === 'correo') {
      this.touched.correo = true;
    } else if (campo === 'password') {
      this.touched.password = true;
    }
  }

  // Método para toggle del password
  toggleMostrarPassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }
}