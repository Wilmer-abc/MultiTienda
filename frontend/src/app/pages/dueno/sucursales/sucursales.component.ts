import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MockDataService, Sucursal } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sucursales.component.html',
  styleUrls: ['./sucursales.component.css']
})
export class SucursalesComponent {
  sucursales: Sucursal[] = [];

  formData = {
    nombre: '',
    direccion: ''
  };

  mostrandoFormulario: boolean = false;

  constructor(private mockDataService: MockDataService) {
    this.sucursales = this.mockDataService.SUCURSALES_MOCK;
  }

  onSubmit(): void {
    const nuevaSucursal: Sucursal = {
      id: Date.now().toString(),
      nombre: this.formData.nombre,
      direccion: this.formData.direccion,
      empresa_id: '1'
    };

    this.sucursales.push(nuevaSucursal);
    this.mostrandoFormulario = false;
    this.resetForm();
  }

  toggleFormulario(): void {
    this.mostrandoFormulario = !this.mostrandoFormulario;
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      direccion: ''
    };
  }
}
