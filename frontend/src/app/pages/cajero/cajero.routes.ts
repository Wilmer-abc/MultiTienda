import { Routes } from '@angular/router';
import { rolGuard } from '../../core/guards/rol.guard';

export const CAJERO_ROUTES: Routes = [
  {
    path: 'pos',
    loadComponent: () => import('./pos/pos.component').then(m => m.PosComponent),
    canActivate: [rolGuard],
    data: { rol: 'CAJERO' }
  },
  {
    path: 'compras-local',
    loadComponent: () => import('./compras-local/compras-local.component').then(m => m.ComprasLocalComponent),
    canActivate: [rolGuard],
    data: { rol: 'CAJERO' }
  },
  {
    path: 'caja',
    loadComponent: () => import('./caja/caja.component').then(m => m.CajaComponent),
    canActivate: [rolGuard],
    data: { rol: 'CAJERO' }
  },
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full'
  }
];
