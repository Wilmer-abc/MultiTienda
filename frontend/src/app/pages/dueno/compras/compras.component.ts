import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  formData = {
    codigoBarras: '',
    cantidad: 1,
    sucursal: 'Zona 14'
  };

  sucursales: string[] = ['Zona 14', 'Zona 10'];
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' = 'success';

  constructor(private inventoryService: InventoryService) {}

  onSubmit(): void {
    if (!this.formData.codigoBarras || this.formData.cantidad <= 0) {
      this.mostrarMensaje('Por favor complete todos los campos correctamente', 'error');
      return;
    }

    const exito = this.inventoryService.registrarCompra(
      this.formData.codigoBarras,
      this.formData.cantidad,
      this.formData.sucursal
    );

    if (exito) {
      this.mostrarMensaje('Compra registrada exitosamente', 'success');
      this.resetForm();
    } else {
      this.mostrarMensaje('Producto no encontrado', 'error');
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'error'): void {
    this.mensaje = mensaje;
    this.tipoMensaje = tipo;
    setTimeout(() => {
      this.mensaje = '';
    }, 3000);
  }

  resetForm(): void {
    this.formData = {
      codigoBarras: '',
      cantidad: 1,
      sucursal: 'Zona 14'
    };
  }
}
