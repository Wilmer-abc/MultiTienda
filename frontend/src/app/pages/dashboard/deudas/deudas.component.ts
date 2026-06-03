import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-deudas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Cuentas por Cobrar (Fiados)</h2>
          <p class="text-sm text-slate-500">Gestiona los clientes que tienen deudas pendientes con la tienda.</p>
        </div>
        <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
          <span class="material-icons">account_balance_wallet</span>
        </div>
      </div>

      <!-- Tarjetas KPIs Deudas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <span class="material-icons">people</span>
          </div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Clientes c/Deuda</p>
            <h3 class="text-2xl font-black text-slate-800">14</h3>
          </div>
        </div>
        
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
            <span class="material-icons">money_off</span>
          </div>
          <div>
            <p class="text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">Monto Total en Calle</p>
            <h3 class="text-2xl font-black text-slate-800">Q 1,250.50</h3>
          </div>
        </div>
        
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <span class="material-icons">price_check</span>
          </div>
          <div>
            <p class="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Cobrado Hoy</p>
            <h3 class="text-2xl font-black text-slate-800">Q 350.00</h3>
          </div>
        </div>
      </div>

      <!-- Lista de Deudores -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200">
            <span class="material-icons text-slate-400 text-[20px]">search</span>
            <input type="text" placeholder="Buscar cliente..." class="bg-transparent border-none outline-none text-sm w-48">
          </div>
          <button class="px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md hover:bg-slate-900 transition-all flex items-center gap-2">
            <span class="material-icons text-[18px]">add</span> Nuevo Crédito (Manual)
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-white text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200">
                <th class="px-6 py-4 font-bold">Cliente</th>
                <th class="px-6 py-4 font-bold">Última Venta</th>
                <th class="px-6 py-4 font-bold">Estado</th>
                <th class="px-6 py-4 font-bold text-right">Deuda Total</th>
                <th class="px-6 py-4 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center">JP</div>
                    <div>
                      <p class="font-bold text-slate-800">Juan Pérez</p>
                      <p class="text-xs text-slate-500">Tel: 555-1234</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">Hace 2 días<br><span class="text-xs font-bold">Ticket #1042</span></td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold">Mora (10 días)</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="font-black text-slate-800 text-lg">Q 450.00</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md transition-all shadow-emerald-500/20">Abonar Pago</button>
                </td>
              </tr>

              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">MG</div>
                    <div>
                      <p class="font-bold text-slate-800">María Gómez</p>
                      <p class="text-xs text-slate-500">Tel: 555-9876</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-slate-500">Ayer<br><span class="text-xs font-bold">Ticket #1055</span></td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-xs font-bold">Pendiente</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="font-black text-slate-800 text-lg">Q 120.00</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <button class="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs shadow-md transition-all shadow-emerald-500/20">Abonar Pago</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class DeudasComponent {}
