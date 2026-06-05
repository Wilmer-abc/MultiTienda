import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService, CartItem } from '../../../core/services/inventory.service';
import { AuthService } from '../../../core/services/auth.service';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  total: number = 0;
  busquedaManual: string = '';
  escannerActivo: boolean = false;
  metodoPago: 'EFECTIVO' | 'TARJETA' = 'EFECTIVO';
  sucursal: string = '';
  productosBuscados: any[] = [];

  private html5QrcodeScanner: Html5QrcodeScanner | null = null;
  private bipAudio: HTMLAudioElement | null = null;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService
  ) {
    this.sucursal = this.authService.getSucursal() || 'Zona 14';
  }

  ngOnInit(): void {
    this.inventoryService.cart$.subscribe(cart => {
      this.cart = cart;
      this.total = this.inventoryService.getCartTotal();
    });

    this.cargarAudioBip();
  }

  ngOnDestroy(): void {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
    }
  }

  cargarAudioBip(): void {
    this.bipAudio = new Audio();
    this.bipAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQkF';
  }

  reproducirBip(): void {
    if (this.bipAudio) {
      this.bipAudio.currentTime = 0;
      this.bipAudio.play().catch(() => {});
    }
  }

  toggleEscanner(): void {
    this.escannerActivo = !this.escannerActivo;
    
    if (this.escannerActivo) {
      this.iniciarEscanner();
    } else {
      this.detenerEscanner();
    }
  }

  iniciarEscanner(): void {
    setTimeout(() => {
      this.html5QrcodeScanner = new Html5QrcodeScanner(
        'reader',
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      this.html5QrcodeScanner.render(
        (decodedText: string) => {
          this.onCodigoEscaneado(decodedText);
        },
        (errorMessage: string) => {}
      );
    }, 100);
  }

  detenerEscanner(): void {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear();
      this.html5QrcodeScanner = null;
    }
  }

  onCodigoEscaneado(codigo: string): void {
    const producto = this.inventoryService.getProductByBarcode(codigo);
    if (producto) {
      this.reproducirBip();
      this.inventoryService.addToCart(producto);
    }
  }

  onBusquedaManual(): void {
    if (this.busquedaManual.length >= 2) {
      this.productosBuscados = this.inventoryService.searchProducts(this.busquedaManual);
    } else {
      this.productosBuscados = [];
    }
  }

  seleccionarProducto(producto: any): void {
    this.inventoryService.addToCart(producto);
    this.busquedaManual = '';
    this.productosBuscados = [];
  }

  actualizarCantidad(codigoBarras: string, cantidad: number): void {
    this.inventoryService.updateCartQuantity(codigoBarras, cantidad);
  }

  eliminarDelCarrito(codigoBarras: string): void {
    this.inventoryService.removeFromCart(codigoBarras);
  }

  procesarVenta(): void {
    const usuario = this.authService.getCurrentUser();
    if (usuario) {
      this.inventoryService.procesarVenta(
        this.sucursal,
        this.metodoPago,
        usuario.email
      );
    }
  }

  limpiarCarrito(): void {
    this.inventoryService.clearCart();
  }
}
