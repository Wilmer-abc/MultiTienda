import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  sucursales: string[] = ['Todas', 'Zona 14', 'Zona 10'];
  sucursalSeleccionada: string = 'Todas';
  
  gananciasBrutas: number = 0;
  gananciasNetas: number = 0;
  deudasProveedores: number = 0;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.calcularReportes();
  }

  onSucursalChange(): void {
    this.calcularReportes();
  }

  calcularReportes(): void {
    if (this.sucursalSeleccionada === 'Todas') {
      this.gananciasBrutas = this.inventoryService.calcularGananciasBrutas();
      this.gananciasNetas = this.inventoryService.calcularGananciasNetas();
    } else {
      this.gananciasBrutas = this.inventoryService.calcularGananciasBrutas(this.sucursalSeleccionada);
      this.gananciasNetas = this.inventoryService.calcularGananciasNetas(this.sucursalSeleccionada);
    }
    
    // Deudas de proveedores (mock)
    this.deudasProveedores = this.sucursalSeleccionada === 'Todas' ? 15000 : 7500;
  }
}
