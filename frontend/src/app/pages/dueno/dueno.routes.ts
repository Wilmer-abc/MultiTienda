import { Routes } from '@angular/router';
import { rolGuard } from '../../core/guards/rol.guard';

export const DUENO_ROUTES: Routes = [
  {
    path: 'reportes',
    loadComponent: () => import('./reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [rolGuard],
    data: { rol: 'DUENO' }
  },
  {
    path: 'alertas',
    loadComponent: () => import('./alertas/alertas.component').then(m => m.AlertasComponent),
    canActivate: [rolGuard],
    data: { rol: 'DUENO' }
  },
  {
    path: 'compras',
    loadComponent: () => import('./compras/compras.component').then(m => m.ComprasComponent),
    canActivate: [rolGuard],
    data: { rol: 'DUENO' }
  },
  {
    path: 'personal',
    loadComponent: () => import('./personal/personal.component').then(m => m.PersonalComponent),
    canActivate: [rolGuard],
    data: { rol: 'DUENO' }
  },
  {
    path: 'sucursales',
    loadComponent: () => import('./sucursales/sucursales.component').then(m => m.SucursalesComponent),
    canActivate: [rolGuard],
    data: { rol: 'DUENO' }
  },
  {
    path: '',
    redirectTo: 'reportes',
    pathMatch: 'full'
  }
];
