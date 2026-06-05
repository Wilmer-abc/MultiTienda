import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MockDataService, Product } from './mock-data.service';

export interface CartItem {
  product: Product;
  cantidad: number;
}

export interface Venta {
  id: string;
  fecha: Date;
  items: CartItem[];
  total: number;
  metodo_pago: 'EFECTIVO' | 'TARJETA';
  sucursal: string;
  cajero: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  private ventasSubject = new BehaviorSubject<Venta[]>([]);
  public ventas$ = this.ventasSubject.asObservable();

  constructor(private mockDataService: MockDataService) {
    // Cargar productos mock al iniciar
    this.productsSubject.next([...this.mockDataService.PRODUCTS_MOCK]);
  }

  // Obtener todos los productos
  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  // Obtener producto por código de barras
  getProductByBarcode(codigo: string): Product | undefined {
    return this.productsSubject.value.find(p => p.codigo_barras === codigo);
  }

  // Buscar productos por nombre
  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.productsSubject.value.filter(p => 
      p.nombre.toLowerCase().includes(lowerQuery) ||
      p.codigo_barras.includes(lowerQuery)
    );
  }

  // Obtener stock de un producto en una sucursal específica
  getStock(product: Product, sucursal: string): number {
    return product.stock_por_sucursal[sucursal] || 0;
  }

  // Verificar si un producto está por debajo del stock mínimo en alguna sucursal
  isBelowMinStock(product: Product, sucursal: string): boolean {
    const stock = this.getStock(product, sucursal);
    return stock < product.stock_minimo;
  }

  // Obtener productos con stock bajo para una sucursal
  getLowStockProducts(sucursal: string): Product[] {
    return this.productsSubject.value.filter(p => this.isBelowMinStock(p, sucursal));
  }

  // Agregar producto al carrito
  addToCart(product: Product, cantidad: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.codigo_barras === product.codigo_barras);

    if (existingItem) {
      existingItem.cantidad += cantidad;
    } else {
      currentCart.push({ product, cantidad });
    }

    this.cartSubject.next([...currentCart]);
  }

  // Eliminar producto del carrito
  removeFromCart(codigoBarras: string): void {
    const currentCart = this.cartSubject.value.filter(
      item => item.product.codigo_barras !== codigoBarras
    );
    this.cartSubject.next(currentCart);
  }

  // Actualizar cantidad de un producto en el carrito
  updateCartQuantity(codigoBarras: string, cantidad: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(i => i.product.codigo_barras === codigoBarras);
    
    if (item) {
      if (cantidad <= 0) {
        this.removeFromCart(codigoBarras);
      } else {
        item.cantidad = cantidad;
        this.cartSubject.next([...currentCart]);
      }
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartSubject.next([]);
  }

  // Obtener total del carrito
  getCartTotal(): number {
    return this.cartSubject.value.reduce(
      (total, item) => total + (item.product.precio_venta * item.cantidad),
      0
    );
  }

  // Procesar venta (disminuir stock)
  procesarVenta(sucursal: string, metodoPago: 'EFECTIVO' | 'TARJETA', cajero: string): Venta {
    const cart = this.cartSubject.value;
    const products = this.productsSubject.value;

    // Actualizar stock de cada producto
    cart.forEach(item => {
      const productIndex = products.findIndex(p => p.codigo_barras === item.product.codigo_barras);
      if (productIndex !== -1) {
        const product = products[productIndex];
        const currentStock = product.stock_por_sucursal[sucursal] || 0;
        product.stock_por_sucursal[sucursal] = currentStock - item.cantidad;
      }
    });

    // Actualizar productos
    this.productsSubject.next([...products]);

    // Crear registro de venta
    const venta: Venta = {
      id: Date.now().toString(),
      fecha: new Date(),
      items: [...cart],
      total: this.getCartTotal(),
      metodo_pago: metodoPago,
      sucursal,
      cajero
    };

    // Guardar venta
    const ventas = this.ventasSubject.value;
    ventas.push(venta);
    this.ventasSubject.next([...ventas]);

    // Limpiar carrito
    this.clearCart();

    return venta;
  }

  // Registrar compra (aumentar stock)
  registrarCompra(codigoBarras: string, cantidad: number, sucursal: string): boolean {
    const products = this.productsSubject.value;
    const productIndex = products.findIndex(p => p.codigo_barras === codigoBarras);

    if (productIndex !== -1) {
      const product = products[productIndex];
      const currentStock = product.stock_por_sucursal[sucursal] || 0;
      product.stock_por_sucursal[sucursal] = currentStock + cantidad;
      this.productsSubject.next([...products]);
      return true;
    }

    return false;
  }

  // Obtener todas las ventas
  getVentas(): Venta[] {
    return this.ventasSubject.value;
  }

  // Obtener ventas por sucursal
  getVentasBySucursal(sucursal: string): Venta[] {
    return this.ventasSubject.value.filter(v => v.sucursal === sucursal);
  }

  // Calcular ganancias brutas
  calcularGananciasBrutas(sucursal?: string): number {
    const ventas = sucursal 
      ? this.getVentasBySucursal(sucursal)
      : this.ventasSubject.value;

    return ventas.reduce((total, venta) => {
      const costoTotal = venta.items.reduce(
        (sum, item) => sum + (item.product.precio_costo * item.cantidad),
        0
      );
      return total + (venta.total - costoTotal);
    }, 0);
  }

  // Calcular ganancias netas
  calcularGananciasNetas(sucursal?: string): number {
    // Por ahora igual a las brutas, se pueden restar gastos adicionales
    return this.calcularGananciasBrutas(sucursal);
  }
}
