import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500/30 flex flex-col">
      <!-- Navbar SaaS -->
      <header class="h-20 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8 sticky top-0 z-50">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span class="material-icons text-white">rocket_launch</span>
          </div>
          <div>
            <h1 class="text-xl font-black tracking-wide leading-tight">MultiTienda <span class="text-blue-500">SaaS</span></h1>
            <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Command Center</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="hidden md:flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span class="text-sm font-bold text-slate-300">Todos los sistemas online</span>
          </div>
          <button (click)="logout()" class="px-5 py-2.5 bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-all border border-rose-500/20">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-8 overflow-y-auto custom-scrollbar">
        
        <!-- Tarjetas KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div class="flex justify-between items-start relative z-10">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Empresas Activas</p>
                <h3 class="text-4xl font-black text-white">142</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <span class="material-icons">domain</span>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span class="material-icons text-[14px]">trending_up</span> +12 este mes
            </div>
          </div>

          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div class="flex justify-between items-start relative z-10">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">MRR (Ingreso Mensual)</p>
                <h3 class="text-4xl font-black text-white">$ 12,450</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400 border border-purple-500/30">
                <span class="material-icons">payments</span>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400">
              <span class="material-icons text-[14px]">trending_up</span> +$1,200 este mes
            </div>
          </div>

          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div class="flex justify-between items-start relative z-10">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Tiendas</p>
                <h3 class="text-4xl font-black text-white">356</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <span class="material-icons">storefront</span>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
              Promedio: 2.5 por empresa
            </div>
          </div>

          <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div class="flex justify-between items-start relative z-10">
              <div>
                <p class="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Tickets Soporte</p>
                <h3 class="text-4xl font-black text-white">4</h3>
              </div>
              <div class="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
                <span class="material-icons">support_agent</span>
              </div>
            </div>
            <div class="mt-4 flex items-center gap-2 text-xs font-bold text-rose-400">
              <span class="material-icons text-[14px]">warning</span> 1 Urgente
            </div>
          </div>
        </div>

        <!-- Tabla de Clientes SaaS -->
        <div class="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl shadow-xl overflow-hidden">
          <div class="p-6 border-b border-slate-700/50 flex justify-between items-center">
            <h2 class="text-xl font-bold text-white">Tus Clientes (Empresas)</h2>
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
              <span class="material-icons text-[18px]">add</span> Nueva Empresa
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                  <th class="px-6 py-4 font-bold">Empresa</th>
                  <th class="px-6 py-4 font-bold">Dueño / Contacto</th>
                  <th class="px-6 py-4 font-bold">Plan Suscripción</th>
                  <th class="px-6 py-4 font-bold">Tiendas</th>
                  <th class="px-6 py-4 font-bold text-right">Estado</th>
                  <th class="px-6 py-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700/50 text-sm">
                <!-- Cliente 1 -->
                <tr class="hover:bg-slate-800/80 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/30">SA</div>
                      <div>
                        <p class="font-bold text-white">Super Ahorro S.A.</p>
                        <p class="text-xs text-slate-400">ID: EMP-001</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-semibold text-slate-200">Carlos Martínez</p>
                    <p class="text-xs text-slate-400">dueno&#64;elahorro.com</p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-bold tracking-wide">PREMIUM</span>
                  </td>
                  <td class="px-6 py-4 text-slate-300 font-medium">3 / 5 max</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 text-emerald-400 text-xs font-bold">
                      <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      Al día
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-2">
                      <button class="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors" title="Editar"><span class="material-icons text-[18px]">edit</span></button>
                      <button class="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors" title="Suspender Servicio"><span class="material-icons text-[18px]">block</span></button>
                    </div>
                  </td>
                </tr>
                <!-- Cliente 2 -->
                <tr class="hover:bg-slate-800/80 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold border border-amber-500/30">FP</div>
                      <div>
                        <p class="font-bold text-white">Ferretería Popular</p>
                        <p class="text-xs text-slate-400">ID: EMP-002</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-semibold text-slate-200">María López</p>
                    <p class="text-xs text-slate-400">mlopez&#64;ferreteria.com</p>
                  </td>
                  <td class="px-6 py-4">
                    <span class="px-3 py-1 bg-slate-700 text-slate-300 border border-slate-600 rounded-full text-xs font-bold tracking-wide">BÁSICO</span>
                  </td>
                  <td class="px-6 py-4 text-slate-300 font-medium">1 / 1 max</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 text-rose-400 text-xs font-bold">
                      <div class="w-2 h-2 rounded-full bg-rose-500"></div>
                      Mora (5 días)
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex justify-center gap-2">
                      <button class="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors" title="Editar"><span class="material-icons text-[18px]">edit</span></button>
                      <button class="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors" title="Suspender Servicio"><span class="material-icons text-[18px]">block</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
  `]
})
export class SuperadminDashboardComponent implements OnInit {
  usuarioLogueado: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioLogueado = this.authService.getUsuario();
    if (this.usuarioLogueado?.rol !== 'superadmin') {
      alert('Acceso Denegado: No eres SuperAdmin');
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
