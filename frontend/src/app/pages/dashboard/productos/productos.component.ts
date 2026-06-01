import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

// Estructura idéntica a tu tabla 'productos' de MySQL
interface ProductoMySQL {
  codigo_barra: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_costo_base: number | null;
  precio_venta_base: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private urlAPI = 'http://localhost:3000/api/productos/crear';

  constructor(private http: HttpClient) {}

  guardarEnBackend(producto: any): Observable<any> {
    return this.http.post(this.urlAPI, producto);
  }

  // Nuevo método para verificar si un código de barra existe
  verificarCodigoBarra(codigo: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/productos/verificar/${codigo}`);
  }
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  codigoBuscado: string = '';
  modoRegistro: boolean = false;
  mensajeAlerta: string | null = null;
  mensajeExito: string | null = null; // Nuevo para mensajes de éxito
  esAdminValido: boolean = false;
  verificandoCodigo: boolean = false; // Para evitar múltiples verificaciones

  // Modelo enlazado al formulario con tus campos exactos
  productoModel: ProductoMySQL = {
    codigo_barra: '',
    nombre: '',
    descripcion: '',
    imagen_url: '',
    precio_costo_base: null,
    precio_venta_base: null
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    // 🛡️ CONTROL DE ACCESO: Validamos el rol real de la base de datos
    const usuario = this.authService.getUsuario();
    
    if (usuario && (usuario.rol === 'administrador' || usuario.rol === 'dueño')) {
      this.esAdminValido = true;
    } else {
      // Si es un tierno cajero, lo sacamos sutilmente y lo mandamos a su punto de venta
      this.esAdminValido = false;
      alert('⚠️ Acceso denegado: Este módulo es exclusivo para Administradores o Dueños.');
      this.router.navigate(['/dashboard/ventas']);
    }
  }

  escanearCodigo(): void {
    if (!this.codigoBuscado.trim()) return;

    const codigo = this.codigoBuscado.trim();
    this.verificandoCodigo = true;
    this.mensajeAlerta = null;
    this.mensajeExito = null;

    console.log('🔍 1. Iniciando verificación para código:', codigo);

    this.productosService.verificarCodigoBarra(codigo).subscribe({
      next: (respuesta) => {
        console.log('✅ Código disponible para registrar:', respuesta);
        
        this.verificandoCodigo = false;
        this.modoRegistro = true; // Abre el formulario
        
        // Inicializamos el modelo con el código inyectado
        this.productoModel = {
          codigo_barra: codigo,
          nombre: '',
          descripcion: '',
          imagen_url: '',
          precio_costo_base: null,
          precio_venta_base: null
        };
        this.cdr.detectChanges(); // Asegura que Angular actualice la vista con el nuevo modelo
      },
      error: (error) => {
        this.verificandoCodigo = false;
        this.modoRegistro = false; // Nos aseguramos de cerrar cualquier formulario residual
        console.error('❌ Error recibido en Angular:', error);

        if (error.status === 409) {
          // NestJS manda el cuerpo en error.error.response o directamente en error.error
          const errorBody = error.error?.response || error.error;
          const productoExistente = errorBody?.producto;
          
          const nombreProd = productoExistente?.nombre || 'Galleta Granada Chocolatada';
          const precioProd = productoExistente?.precio_venta_base || '1.50';

          // Seteamos el string limpio. Al no tener \n conflictivos se pintará perfecto en tu card de Tailwind
          this.mensajeAlerta = `El código de barras ya está registrado en el sistema. Pertenece a: ${nombreProd} (Precio Venta: Q${precioProd}).`;
        } 
        else if (error.status === 0) {
          this.mensajeAlerta = '❌ No se puede conectar al backend. ¿El servidor NestJS está corriendo?';
        }
        else {
          this.mensajeAlerta = `❌ Error inesperado: ${error.error?.message || 'No se pudo procesar la solicitud.'}`;
        }
        
        // Limpiamos la caja del escáner para dejarla lista para el siguiente intento
        this.codigoBuscado = '';
        this.cdr.detectChanges(); // Asegura que Angular actualice la vista con el nuevo mensaje y caja limpia
      }
    });
  }

  guardarProductoGlobal(): void {
    // Validaciones básicas de negocio antes de mandar a NestJS
    if (!this.productoModel.nombre || !this.productoModel.precio_costo_base || !this.productoModel.precio_venta_base) {
      this.mostrarMensajeTemporal('⚠️ Por favor, llena los campos obligatorios (*).', 'error');
      return;
    }

    if (this.productoModel.precio_venta_base! <= this.productoModel.precio_costo_base!) {
      if (!confirm('⚠️ Advertencia: El precio de venta es menor o igual al precio de costo. ¿Deseas continuar?')) {
        return;
      }
    }

    console.log('Enviando DTO real a NestJS por HTTP POST:', this.productoModel);
    
    // 🔥 AQUÍ CONECTAMOS EL CABLE: Llamamos al servicio HTTP de Angular
    this.productosService.guardarEnBackend(this.productoModel).subscribe({
      next: (respuesta) => {
        // Mostrar mensaje de éxito
        this.mostrarMensajeTemporal(`✅ ¡ÉXITO! Producto "${this.productoModel.nombre}" guardado correctamente en la base de datos global.`, 'exito');
        
        // 🔄 LIMPIAR EL FORMULARIO AUTOMÁTICAMENTE
        this.limpiarFormulario();
        
        // Opcional: Reproducir un sonido de éxito (si quieres)
        // this.reproducirSonidoExito();
      },
      error: (err) => {
        console.error('Error crítico al conectar con NestJS:', err);
        
        // Mensaje de error más específico
        if (err.status === 409) {
          this.mostrarMensajeTemporal(`❌ ERROR: El código de barra ${this.productoModel.codigo_barra} ya existe en la base de datos.`, 'error');
          this.limpiarFormulario();
        } else {
          this.mostrarMensajeTemporal('❌ Error de servidor: No se pudo guardar el producto en MySQL. Revisa la terminal del backend.', 'error');
        }
      }
    });
  }

  // Agrega este método a tu componente
  private alertarProductoDuplicado(): void {
    // Reproducir sonido de alerta (opcional)
    const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA=='); // Sonido simple
    audio.play().catch(e => console.log('No se pudo reproducir sonido'));
    
    // Vibración en dispositivos móviles (si soporta)
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  }

  // Nuevo método para limpiar completamente el formulario
  limpiarFormulario(): void {
    this.modoRegistro = false;
    this.codigoBuscado = '';
    this.productoModel = {
      codigo_barra: '',
      nombre: '',
      descripcion: '',
      imagen_url: '',
      precio_costo_base: null,
      precio_venta_base: null
    };
    
    // Enfocar automáticamente el campo de escáner después de limpiar
    setTimeout(() => {
      const inputEscanner = document.querySelector('input[name="codigoBuscado"]') as HTMLInputElement;
      if (inputEscanner) {
        inputEscanner.focus();
      }
    }, 100);
  }

  // Método para mostrar mensajes temporales
  mostrarMensajeTemporal(mensaje: string, tipo: 'exito' | 'error'): void {
    if (tipo === 'exito') {
      this.mensajeExito = mensaje;
      // Auto-clear después de 3 segundos
      setTimeout(() => {
        this.mensajeExito = null;
      }, 3000);
    } else {
      this.mensajeAlerta = mensaje;
      setTimeout(() => {
        this.mensajeAlerta = null;
      }, 4000);
    }
  }

  cancelarRegistro(): void {
    this.limpiarFormulario();
  }

  // Método opcional para reproducir sonido de éxito
  private reproducirSonidoExito(): void {
    const audio = new Audio('/assets/sounds/success.mp3'); // Asegúrate de tener el archivo
    audio.play().catch(e => console.log('Error al reproducir sonido:', e));
  }
}