import { Routes } from '@angular/router';
import { rolGuard } from '../../core/guards/rol.guard';

export const SUPERADMIN_ROUTES: Routes = [
  {
    path: 'empresas',
    loadComponent: () => import('./empresas/empresas.component').then(m => m.EmpresasComponent),
    canActivate: [rolGuard],
    data: { rol: 'SUPERADMIN' }
  },
  {
    path: 'nueva-tienda',
    loadComponent: () => import('./nueva-tienda/nueva-tienda.component').then(m => m.NuevaTiendaComponent),
    canActivate: [rolGuard],
    data: { rol: 'SUPERADMIN' }
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./ajustes/ajustes.component').then(m => m.AjustesComponent),
    canActivate: [rolGuard],
    data: { rol: 'SUPERADMIN' }
  },
  {
    path: '',
    redirectTo: 'empresas',
    pathMatch: 'full'
  }
];
