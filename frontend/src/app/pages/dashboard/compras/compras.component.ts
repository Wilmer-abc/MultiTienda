import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Módulo de Compras (Ingreso de Stock)</h2>
          <p class="text-sm text-slate-500">Escanea los productos que trae el proveedor para inyectar stock.</p>
        </div>
        <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
          <span class="material-icons">local_shipping</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Escáner Móvil / Búsqueda -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center">
          <div class="w-full aspect-video bg-slate-900 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
            <!-- Mock visual de cámara -->
            <div class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <span class="material-icons text-5xl text-slate-600">qr_code_scanner</span>
            <div class="absolute inset-4 border-2 border-blue-500/50 rounded-xl"></div>
            <div class="absolute left-0 right-0 top-1/2 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)] animate-pulse"></div>
          </div>
          <button class="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
            <span class="material-icons">camera_alt</span> Activar Cámara de Teléfono
          </button>
          
          <div class="w-full mt-6">
            <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">O Buscar Manualmente</label>
            <div class="flex gap-2 mt-2">
              <input type="text" placeholder="Código de barras..." class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <button class="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900"><span class="material-icons text-[20px] mt-1">search</span></button>
            </div>
          </div>
        </div>

        <!-- Lista de Ingreso -->
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[500px]">
          <div class="flex justify-between items-end mb-4">
            <h3 class="font-bold text-slate-700">Factura de Ingreso</h3>
            <span class="text-2xl font-black text-slate-800">Total: Q 1,450.00</span>
          </div>
          
          <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <p class="font-bold text-slate-800 text-sm">Agua Salvavidas 600ml</p>
                <div class="flex gap-4 mt-1 text-xs">
                  <span class="text-slate-500">Costo: Q3.00</span>
                  <span class="text-emerald-600 font-bold">+50 Unidades</span>
                </div>
              </div>
              <span class="font-black text-slate-800">Q 150.00</span>
            </div>
            
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
              <div>
                <p class="font-bold text-slate-800 text-sm">Galleta Oreo</p>
                <div class="flex gap-4 mt-1 text-xs">
                  <span class="text-slate-500">Costo: Q2.50</span>
                  <span class="text-emerald-600 font-bold">+100 Unidades</span>
                </div>
              </div>
              <span class="font-black text-slate-800">Q 250.00</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-slate-100">
            <label class="block text-xs font-bold text-slate-500 mb-1">Proveedor (Opcional)</label>
            <select class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 mb-4 outline-none">
              <option>Distribuidora Central</option>
              <option>Bimbo S.A.</option>
              <option>Coca-Cola FEMSA</option>
            </select>
            <button class="w-full py-3 bg-slate-800 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
              <span class="material-icons">save</span> Registrar Compra (Inyectar Stock)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
  `]
})
export class ComprasComponent {}
