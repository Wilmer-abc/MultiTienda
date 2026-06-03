import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans selection:bg-blue-500/30">
      
      <!-- Mobile Top Bar -->
      <div class="md:hidden h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md">
            <span class="material-icons text-white text-sm">dashboard</span>
          </div>
          <span class="font-black text-slate-800 tracking-wide">MultiTienda</span>
        </div>
        <button (click)="menuAbierto = !menuAbierto" class="text-slate-500 hover:text-slate-800">
          <span class="material-icons">{{ menuAbierto ? 'close' : 'menu' }}</span>
        </button>
      </div>

      <!-- Sidebar -->
      <aside [ngClass]="{'hidden': !menuAbierto, 'flex': menuAbierto}" class="md:flex w-full md:w-72 bg-white border-r border-slate-200 flex-col absolute md:relative z-40 h-[calc(100vh-4rem)] md:h-screen shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div class="hidden md:flex h-20 items-center px-8 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span class="material-icons text-white">dashboard</span>
            </div>
            <div>
              <h1 class="text-lg font-black text-slate-800 tracking-wide leading-tight">MultiTienda</h1>
              <p class="text-xs text-slate-500 font-bold uppercase tracking-widest">Workspace</p>
            </div>
          </div>
        </div>
        
        <div class="px-6 py-6">
          <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase mb-4 px-2">Navegación</p>
          <nav class="space-y-1.5" (click)="menuAbierto = false">
            <a routerLink="pos" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
              <span class="material-icons text-[20px]">point_of_sale</span>
              Punto de Venta
            </a>

            <ng-container *ngIf="rol === 'dueño' || rol === 'administrador'">
              <a routerLink="dashboard" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
                <span class="material-icons text-[20px]">analytics</span>
                Resumen
              </a>
              <a routerLink="productos" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
                <span class="material-icons text-[20px]">inventory_2</span>
                Catálogo Global
              </a>
              <a routerLink="compras" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
                <span class="material-icons text-[20px]">local_shipping</span>
                Compras a Prov.
              </a>
              <a routerLink="deudas" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
                <span class="material-icons text-[20px]">account_balance_wallet</span>
                Cuentas x Cobrar
              </a>
              <a routerLink="usuarios" routerLinkActive="bg-blue-50 text-blue-700 font-bold" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-semibold transition-all">
                <span class="material-icons text-[20px]">group</span>
                Personal
              </a>
            </ng-container>
          </nav>
        </div>

        <div class="mt-auto p-6 border-t border-slate-100">
          <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
            <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <span class="material-icons text-slate-400">person</span>
            </div>
            <div class="overflow-hidden">
              <p class="text-sm font-bold text-slate-800 truncate capitalize">{{ nombre }}</p>
              <p class="text-xs font-medium text-slate-500 truncate capitalize">Rol: {{ rol }}</p>
            </div>
          </div>
          <button (click)="logout()" class="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
            <span class="material-icons text-[18px]">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col relative overflow-hidden bg-slate-50/50">
        
        <header class="hidden md:flex h-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 relative z-10 border-b border-slate-200/60">
          <h2 class="text-xl font-black text-slate-800 tracking-tight">MultiTienda OS</h2>
          <div class="flex items-center gap-4">
            <button class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:shadow-sm transition-all relative">
              <span class="material-icons text-xl">notifications</span>
              <span class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>
        
        <div class="flex-1 p-6 md:p-10 overflow-auto relative z-10 custom-scrollbar">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  `]
})
export class AdminLayoutComponent {
  rol = '';
  nombre = '';
  menuAbierto = false;

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getUsuario();
    if (user) {
      this.rol = user.rol;
      this.nombre = user.nombre;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
