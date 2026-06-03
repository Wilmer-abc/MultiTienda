import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Html5Qrcode } from 'html5-qrcode';
import { ProductosService } from '../../core/services/productos.service';

@Component({
  selector: 'app-pos-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-screen flex flex-col bg-slate-100 text-slate-800 font-sans selection:bg-blue-500/30">
      
      <!-- Top Mobile Navigation (Balanced Glassmorphism) -->
      <header class="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
            <span class="material-icons text-sm text-white">storefront</span>
          </div>
          <h1 class="text-lg font-bold tracking-tight text-slate-800">Punto de Venta</h1>
        </div>
        <button class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sucursal Z-14
        </button>
      </header>

      <!-- Main Layout -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        <!-- Contenedor del Escáner -->
        <div class="w-full lg:w-1/3 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-4 lg:p-6 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-sm font-bold text-slate-500 uppercase tracking-wider">Escáner</h2>
            <button (click)="toggleScanner()" class="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors shadow-sm border border-blue-100/50">
              <span class="material-icons text-xl">{{ isScanning ? 'videocam_off' : 'qr_code_scanner' }}</span>
            </button>
          </div>

          <!-- Cámara Viewport -->
          <div class="relative w-full aspect-square md:aspect-video lg:aspect-square bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-xl flex flex-col items-center justify-center">
            
            <div id="reader" class="w-full h-full object-cover"></div>
            
            <!-- Overlay visual si no está escaneando -->
            <div *ngIf="!isScanning" class="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/90 backdrop-blur-sm z-20">
              <div class="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center mb-4 shadow-inner">
                <span class="material-icons text-3xl text-slate-400">center_focus_weak</span>
              </div>
              <p class="text-slate-300 text-sm font-medium">Cámara Pausada</p>
              <button (click)="toggleScanner()" class="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-500 transition-colors shadow-lg">
                Activar Escáner
              </button>
            </div>
            
            <!-- Esquinas de mira flotantes -->
            <div *ngIf="isScanning" class="absolute inset-6 border-2 border-blue-500/30 rounded-3xl pointer-events-none z-20">
              <div class="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
              <div class="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
              <div class="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
              <div class="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
              <div class="absolute left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_3px_rgba(59,130,246,0.5)] animate-[scan_2s_ease-in-out_infinite]"></div>
            </div>
          </div>

          <!-- Último producto escaneado -->
          <div class="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
            <div class="w-12 h-12 rounded-xl bg-slate-50 flex flex-shrink-0 items-center justify-center border border-slate-100 overflow-hidden">
              <span class="material-icons text-slate-400" *ngIf="!ultimoProducto">inventory_2</span>
              <img *ngIf="ultimoProducto?.imagen" [src]="ultimoProducto.imagen" class="w-full h-full object-cover">
            </div>
            <div class="overflow-hidden">
              <p class="text-[10px] text-blue-600 font-bold mb-0.5 tracking-widest uppercase">Detectado</p>
              <p class="text-sm text-slate-700 truncate font-semibold">{{ ultimoProducto?.nombre || 'Esperando lectura...' }}</p>
            </div>
          </div>
        </div>

        <!-- Ticket / Venta -->
        <div class="w-full lg:w-2/3 flex flex-col bg-slate-50/50 relative">
          
          <!-- Cliente Badge -->
          <div class="p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex justify-between items-center z-10 sticky top-0">
            <div class="flex items-center gap-2.5 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
              <div class="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"></div>
              <span class="text-slate-700 text-sm font-bold">Consumidor Final</span>
            </div>
            <button class="text-blue-600 text-sm hover:text-blue-700 transition-colors font-semibold flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full">
              <span>Cambiar</span>
              <span class="material-icons text-sm">edit</span>
            </button>
          </div>

          <!-- Lista de Items -->
          <div class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3">
            
            <div *ngIf="carrito.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
              <span class="material-icons text-5xl mb-2 opacity-50">shopping_basket</span>
              <p>El carrito está vacío</p>
            </div>

            <div *ngFor="let item of carrito; let i = index" class="group bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between transition-all shadow-sm hover:shadow-md cursor-default">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm border border-slate-200 cursor-pointer" (click)="cambiarCantidad(i, 1)">{{ item.cantidad }}</div>
                <div>
                  <h3 class="text-slate-800 font-bold leading-tight">{{ item.nombre }}</h3>
                  <p class="text-slate-500 text-xs mt-1 font-medium">Cod: {{ item.codigo_barra }}</p>
                </div>
              </div>
              <div class="text-right flex flex-col items-end">
                <span class="text-lg font-black text-slate-800 tracking-tight">Q {{ (item.precio_venta_base * item.cantidad).toFixed(2) }}</span>
                <button (click)="quitarItem(i)" class="text-rose-500/0 group-hover:text-rose-500 text-xs font-bold flex items-center mt-1 transition-colors">
                  <span class="material-icons text-[16px] mr-1">delete_outline</span> Quitar
                </button>
              </div>
            </div>

          </div>

          <!-- Panel de Cobro Inferior -->
          <div class="p-6 bg-white border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] z-20">
            <div class="flex justify-between items-end mb-4">
              <div>
                <p class="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Total a Pagar</p>
                <p class="text-slate-400 text-xs font-medium">Impuestos incluidos</p>
              </div>
              <div class="text-right">
                <span class="text-4xl font-black text-slate-800 tracking-tighter">Q {{ calcularTotal().toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <button (click)="cobrarVenta('efectivo')" [disabled]="carrito.length === 0" class="w-full relative overflow-hidden rounded-2xl p-3 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg active:scale-[0.98]">
                <div class="relative z-10 flex flex-col items-center justify-center">
                  <span class="material-icons text-white mb-1">payments</span>
                  <span class="text-white font-bold text-xs uppercase">Efectivo</span>
                </div>
              </button>
              
              <button (click)="abrirModalCredito()" [disabled]="carrito.length === 0" class="w-full relative overflow-hidden rounded-2xl p-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.98]">
                <div class="relative z-10 flex flex-col items-center justify-center">
                  <span class="material-icons text-white mb-1">account_balance_wallet</span>
                  <span class="text-white font-bold text-xs uppercase">Fiado (Crédito)</span>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Modal de Fiado (Crédito) -->
      <div *ngIf="mostrarModalCredito" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span class="material-icons">account_balance_wallet</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800">Venta al Crédito (Fiado)</h3>
              <p class="text-xs text-slate-500">Monto: Q {{ calcularTotal().toFixed(2) }}</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Nombre del Cliente</label>
              <input type="text" [(ngModel)]="nombreClienteFiado" placeholder="Ej. Don José" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none">
            </div>
          </div>

          <div class="flex gap-3 mt-8">
            <button (click)="cerrarModalCredito()" class="flex-1 py-3 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors">Cancelar</button>
            <button (click)="cobrarVenta('credito')" [disabled]="!nombreClienteFiado" class="flex-1 py-3 rounded-xl text-white font-bold bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 transition-colors shadow-lg shadow-amber-500/30">Confirmar Fiado</button>
          </div>
        </div>
      </div>

      <!-- Modal de Producto Nuevo (Express) -->
      <div *ngIf="mostrarModalNuevo" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <span class="material-icons">new_releases</span>
            </div>
            <div>
              <h3 class="text-lg font-bold text-slate-800">Producto Nuevo Detectado</h3>
              <p class="text-xs text-slate-500">Completa los datos para venderlo</p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Código de Barras</label>
              <input type="text" disabled [value]="productoNuevo.codigo_barra" class="w-full bg-slate-100 border-none rounded-xl px-4 py-2 text-slate-500 text-sm font-mono">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Nombre del Producto</label>
              <input type="text" [(ngModel)]="productoNuevo.nombre" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">Costo (Q)</label>
                <input type="number" [(ngModel)]="productoNuevo.precio_costo_base" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-500 mb-1">Venta (Q)</label>
                <input type="number" [(ngModel)]="productoNuevo.precio_venta_base" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
              </div>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button (click)="cerrarModalNuevo()" [disabled]="guardandoProducto" class="flex-1 py-2.5 rounded-xl text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50">Cancelar</button>
            <button (click)="guardarProductoRapido()" [disabled]="guardandoProducto" class="flex-1 py-2.5 rounded-xl text-white font-bold bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ guardandoProducto ? 'Guardando...' : 'Guardar y Añadir' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes scan {
      0% { top: 0%; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
  `]
})
export class PosTerminalComponent implements OnInit, OnDestroy {
  html5Qrcode: Html5Qrcode | null = null;
  isScanning = false;
  procesandoLectura = false; // Bloqueo lógico (Cooldown)
  ultimoProducto: any = null;

  // Lógica del Carrito
  carrito: any[] = [];
  
  // Lógica del Modal Express
  mostrarModalNuevo = false;
  productoNuevo: any = {
    codigo_barra: '',
    nombre: '',
    descripcion: '',
    imagen_url: '',
    precio_costo_base: null,
    precio_venta_base: null
  };

  // Lógica de Crédito / Fiado
  mostrarModalCredito = false;
  nombreClienteFiado = '';

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.html5Qrcode = new Html5Qrcode("reader");
  }

  ngOnDestroy() {
    this.detenerEscaner();
  }

  async toggleScanner() {
    if (this.isScanning) {
      await this.detenerEscaner();
    } else {
      await this.iniciarEscaner();
    }
  }

  async iniciarEscaner() {
    if (!this.html5Qrcode) return;

    try {
      this.isScanning = true;
      await this.html5Qrcode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          this.manejarCodigoEscaneado(decodedText);
        },
        (errorMessage) => { }
      );
    } catch (err) {
      console.error("No se pudo iniciar la cámara", err);
      this.isScanning = false;
      alert('Por favor permite el acceso a la cámara.');
    }
  }

  async detenerEscaner() {
    if (this.html5Qrcode && this.isScanning) {
      try {
        await this.html5Qrcode.stop();
        this.isScanning = false;
      } catch (err) {
        console.error("Error al detener cámara", err);
      }
    }
  }

  manejarCodigoEscaneado(codigo: string) {
    if (this.procesandoLectura || this.mostrarModalNuevo) return; // Si está en cooldown o en el modal, ignorar
    
    this.procesandoLectura = true;
    
    // Buscar en la BD
    this.productosService.verificarCodigoBarra(codigo).subscribe({
      next: (res) => {
        // La API dice que está DISPONIBLE para registrar. (Es decir, NO existe en BD)
        this.reproducirSonidoError();
        this.ultimoProducto = { nombre: `Desconocido: ${codigo}`, imagen: null };
        
        // Abrimos Modal Express con lo que haya encontrado la API (OpenFoodFacts)
        this.productoNuevo = {
          codigo_barra: codigo,
          nombre: res.nombre_sugerido || '',
          descripcion: '',
          imagen_url: res.imagen_sugerida || '',
          precio_costo_base: null,
          precio_venta_base: null
        };
        this.mostrarModalNuevo = true;
        
        // Liberamos el cooldown, pero la cámara sigue encendida (solo que ignorada por el flag mostrarModalNuevo)
        setTimeout(() => this.procesandoLectura = false, 1500);
      },
      error: (err) => {
        // En nuestra API, 409 significa que YA EXISTE.
        if (err.status === 409) {
          const productoBD = err.error?.producto || err.error?.response?.producto;
          if (productoBD) {
            this.reproducirSonido();
            this.agregarAlCarrito(productoBD);
          }
        } else {
          this.reproducirSonidoError();
          console.error("Error de red", err);
        }
        
        // Liberar el cooldown en 1.5s
        setTimeout(() => this.procesandoLectura = false, 1500);
      }
    });
  }

  agregarAlCarrito(producto: any) {
    this.ultimoProducto = producto;
    
    // Verificar si ya existe en el carrito
    const itemExistente = this.carrito.find(item => item.codigo_barra === producto.codigo_barra);
    
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    
    // Bajar scroll automáticamente (opcional)
  }

  quitarItem(index: number) {
    this.carrito.splice(index, 1);
  }

  cambiarCantidad(index: number, delta: number) {
    this.carrito[index].cantidad += delta;
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + (Number(item.precio_venta_base) * item.cantidad), 0);
  }

  cerrarModalNuevo() {
    this.mostrarModalNuevo = false;
  }

  guardandoProducto = false;

  guardarProductoRapido() {
    if (this.guardandoProducto) return;
    
    if (!this.productoNuevo.nombre || !this.productoNuevo.precio_venta_base || !this.productoNuevo.precio_costo_base) {
      alert("Por favor llena el nombre y los precios.");
      return;
    }

    this.guardandoProducto = true;

    this.productosService.guardarEnBackend(this.productoNuevo).subscribe({
      next: (res) => {
        this.mostrarModalNuevo = false;
        this.guardandoProducto = false;
        // Agregarlo directamente al carrito para no tener que volver a escanearlo
        this.agregarAlCarrito({
          ...this.productoNuevo,
          id: res.id || Date.now() // Mock ID temporal hasta que se refresque
        });
        this.reproducirSonido();
      },
      error: (err) => {
        this.guardandoProducto = false;
        alert("Error al guardar producto rápido.");
      }
    });
  }

  abrirModalCredito() {
    this.mostrarModalCredito = true;
  }

  cerrarModalCredito() {
    this.mostrarModalCredito = false;
    this.nombreClienteFiado = '';
  }

  cobrarVenta(metodo: 'efectivo' | 'credito' = 'efectivo') {
    if (this.carrito.length === 0) return;

    const datosVenta = {
      carrito: this.carrito,
      metodo_pago: metodo,
      cliente: metodo === 'credito' ? this.nombreClienteFiado : null
    };

    this.productosService.registrarVenta(datosVenta).subscribe({
      next: (res) => {
        this.reproducirSonidoExitoCobro();
        alert(`¡Venta cobrada con éxito! Total: Q ${this.calcularTotal().toFixed(2)}`);
        this.carrito = [];
        this.ultimoProducto = null;
        if (metodo === 'credito') {
          this.cerrarModalCredito();
        }
      },
      error: (err) => {
        console.error(err);
        alert('Hubo un error al procesar la venta. Revisa la consola.');
      }
    });
  }

  private reproducirSonidoExitoCobro() {
    try {
      // Un Bip agudo o sonido de caja registradora
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, context.currentTime); // Hz
      oscillator.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    } catch(e) {}
  }

  private reproducirSonido() {
    try {
      const audio = new Audio();
      audio.src = 'assets/bip.mp3';
      audio.load();
      audio.play();
    } catch (e) {}
  }

  private reproducirSonidoError() {
    try {
      // Un Bip más grave o un buzzer
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(150, context.currentTime); // Hz
      oscillator.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.3);
    } catch(e) {}
  }
}
