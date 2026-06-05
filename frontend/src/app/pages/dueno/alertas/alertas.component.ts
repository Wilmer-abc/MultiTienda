import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {
  sucursales: string[] = ['Zona 14', 'Zona 10'];
  sucursalSeleccionada: string = 'Zona 14';
  productosBajoStock: Product[] = [];

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

  onSucursalChange(): void {
    this.cargarAlertas();
  }

  cargarAlertas(): void {
    this.productosBajoStock = this.inventoryService.getLowStockProducts(this.sucursalSeleccionada);
  }
}
