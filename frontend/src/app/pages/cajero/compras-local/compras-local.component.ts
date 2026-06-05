import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-compras-local',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compras-local.component.html',
  styleUrls: ['./compras-local.component.css']
})
export class ComprasLocalComponent {
  formData = {
    codigoBarras: '',
    cantidad: 1
  };

  sucursal: string = '';
  mensaje: string = '';
  tipoMensaje: 'success' | 'error' = 'success';

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    this.sucursal = this.authService.getSucursal() || 'Zona 14';
  }

  onSubmit(): void {
    if (!this.formData.codigoBarras || this.formData.cantidad <= 0) {
      this.mostrarMensaje('Por favor complete todos los campos correctamente', 'error');
      return;
    }

    const exito = this.inventoryService.registrarCompra(
      this.formData.codigoBarras,
      this.formData.cantidad,
      this.sucursal
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
      cantidad: 1
    };
  }
}
