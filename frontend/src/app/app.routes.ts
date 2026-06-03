import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // 👔 SUPERADMIN: Gestión de licencias y empresas (SaaS)
  {
    path: 'superadmin',
    canActivate: [rolGuard],
    data: { roles: ['superadmin'] },
    loadComponent: () => import('./pages/superadmin/superadmin-dashboard.component').then(m => m.SuperadminDashboardComponent)
  },

  // 📦 PANEL PRINCIPAL (Unificado para Dueño, Admin y Cajero)
  {
    path: 'panel',
    canActivate: [rolGuard],
    data: { roles: ['dueño', 'administrador', 'cajero'] },
    loadComponent: () => import('./pages/admin/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      // Si entra a /panel, redirige según el rol
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/dashboard/layout/layout.component').then(m => m.LayoutComponent) 
      },
      { 
        path: 'pos', 
        loadComponent: () => import('./pages/pos/pos-terminal.component').then(m => m.PosTerminalComponent) 
      },
      { 
        path: 'productos', 
        loadComponent: () => import('./pages/dashboard/productos/productos.component').then(m => m.ProductosComponent) 
      },
      { 
        path: 'compras', 
        loadComponent: () => import('./pages/dashboard/compras/compras.component').then(m => m.ComprasComponent) 
      },
      { 
        path: 'deudas', 
        loadComponent: () => import('./pages/dashboard/deudas/deudas.component').then(m => m.DeudasComponent) 
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/dashboard/usuarios/usuarios.component').then(m => m.UsuariosComponent) 
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];