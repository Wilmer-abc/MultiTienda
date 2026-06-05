import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, Venta } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  sucursal: string = '';
  totalVentas: number = 0;
  filtroFecha: string = 'hoy';

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    this.sucursal = this.authService.getSucursal() || 'Zona 14';
  }

  ngOnInit(): void {
    this.inventoryService.ventas$.subscribe(ventas => {
      this.ventas = ventas;
      this.filtrarVentas();
    });
  }

  onFiltroChange(): void {
    this.filtrarVentas();
  }

  filtrarVentas(): void {
    const ventasSucursal = this.ventas.filter(v => v.sucursal === this.sucursal);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    switch (this.filtroFecha) {
      case 'hoy':
        this.ventasFiltradas = ventasSucursal.filter(v => {
          const ventaFecha = new Date(v.fecha);
          ventaFecha.setHours(0, 0, 0, 0);
          return ventaFecha.getTime() === hoy.getTime();
        });
        break;
      case 'semana':
        const semanaAgo = new Date(hoy);
        semanaAgo.setDate(semanaAgo.getDate() - 7);
        this.ventasFiltradas = ventasSucursal.filter(v => new Date(v.fecha) >= semanaAgo);
        break;
      case 'mes':
        const mesAgo = new Date(hoy);
        mesAgo.setMonth(mesAgo.getMonth() - 1);
        this.ventasFiltradas = ventasSucursal.filter(v => new Date(v.fecha) >= mesAgo);
        break;
      default:
        this.ventasFiltradas = ventasSucursal;
    }

    this.totalVentas = this.ventasFiltradas.reduce((total, v) => total + v.total, 0);
  }

  getMetodoPagoIcon(metodo: string): string {
    return metodo === 'EFECTIVO' ? 'payments' : 'credit_card';
  }

  getMetodoPagoColor(metodo: string): string {
    return metodo === 'EFECTIVO' ? '#4ade80' : '#3b82f6';
  }
}
