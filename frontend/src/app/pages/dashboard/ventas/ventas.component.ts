import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductoCarrito {
  id: number;
  codigoBarra: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {
  // Input donde entra el código del escáner
  codigoEscaneado: string = '';
  
  // El carrito de la venta actual
  carrito: ProductoCarrito[] = [];
  
  // Totales
  totalVenta: number = 0;
  efectivoRecibido: number | null = null;
  vuelto: number = 0;

  // SIMULACIÓN DE BASE DE DATOS GLOBAL (Catálogo de la Tienda)
  // En el siguiente paso, esto vendrá de una petición GET a NestJS
  private catalogoProductos = [
    { id: 1, codigoBarra: '74010011', nombre: 'Tortrix Barbacoa', precio: 2.00 },
    { id: 2, codigoBarra: '74010022', nombre: 'Coca-Cola Desechable 500ml', precio: 6.00 },
    { id: 3, codigoBarra: '74010033', nombre: 'Agua Pura Salvavidas 1L', precio: 5.00 },
    { id: 4, codigoBarra: '74010044', nombre: 'Ricitos Fiesta', precio: 4.00 }
  ];

  // Método que se dispara cuando el escáner lee un código (o se presiona Enter)
  buscarProducto(): void {
    if (!this.codigoEscaneado.trim()) return;

    // Buscamos si el código existe en el catálogo de la tienda
    const productoEncontrado = this.catalogoProductos.find(
      p => p.codigoBarra === this.codigoEscaneado.trim()
    );

    if (productoEncontrado) {
      // Si el producto ya estaba en el carrito, solo le sumamos 1 a la cantidad
      const productoEnCarrito = this.carrito.find(item => item.id === productoEncontrado.id);

      if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
        productoEnCarrito.subtotal = productoEnCarrito.cantidad * productoEnCarrito.precio;
      } else {
        // Si es nuevo en la venta actual, lo agregamos completo
        this.carrito.push({
          id: productoEncontrado.id,
          codigoBarra: productoEncontrado.codigoBarra,
          nombre: productoEncontrado.nombre,
          precio: productoEncontrado.precio,
          cantidad: 1,
          subtotal: productoEncontrado.precio
        });
      }
      this.calcularTotales();
    } else {
      alert('Producto no encontrado o no registrado en esta sucursal.');
    }

    // Limpiamos el input para que quede listo para el siguiente escaneo
    this.codigoEscaneado = '';
  }

  // Actualizar totales de la venta
  calcularTotales(): void {
    this.totalVenta = this.carrito.reduce((sum, item) => sum + item.subtotal, 0);
    this.calcularVuelto();
  }

  // Calcular el cambio/vuelto en Quetzales
  calcularVuelto(): void {
    if (this.efectivoRecibido && this.efectivoRecibido >= this.totalVenta) {
      this.vuelto = this.efectivoRecibido - this.totalVenta;
    } else {
      this.vuelto = 0;
    }
  }

  // Eliminar un ítem del carrito
  eliminarItem(index: number): void {
    this.carrito.splice(index, 1);
    this.calcularTotales();
  }

  // Vaciar por completo la venta actual
  cancelarVenta(): void {
    if (confirm('¿Estás seguro de cancelar la venta actual?')) {
      this.carrito = [];
      this.totalVenta = 0;
      this.efectivoRecibido = null;
      this.vuelto = 0;
    }
  }

  // Guardar la venta en la Base de Datos a través de NestJS
  registrarVenta(): void {
    if (this.carrito.length === 0) {
      alert('El carrito está vacío.');
      return;
    }
    
    // Aquí estructuramos lo que le enviaremos al backend
    const datosVenta = {
      productos: this.carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio
      })),
      total: this.totalVenta
    };

    console.log('Enviando venta a NestJS:', datosVenta);
    
    // Simulación de éxito. Pronto pondremos el `http.post` real aquí
    alert('¡Venta registrada con éxito en Tienda #1! Stock actualizado.');
    
    // Limpiamos todo para el siguiente cliente
    this.carrito = [];
    this.totalVenta = 0;
    this.efectivoRecibido = null;
    this.vuelto = 0;
  }
}