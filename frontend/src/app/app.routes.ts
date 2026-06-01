import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { LayoutComponent } from './pages/dashboard/layout/layout.component';
import { VentasComponent } from './pages/dashboard/ventas/ventas.component';
import { ProductosComponent } from './pages/dashboard/productos/productos.component';
import { UsuariosComponent } from './pages/dashboard/usuarios/usuarios.component'; 
import { rolGuard } from './core/guards/rol.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: LayoutComponent,
    canActivate: [rolGuard],
    data: { roles: ['dueño', 'administrador', 'cajero'] }, // Cualquiera logueado entra al Layout
    children: [
      { path: '', redirectTo: 'ventas', pathMatch: 'full' },
      
      // 🛒 El cajero y los de arriba pueden vender
      { 
        path: 'ventas', 
        component: VentasComponent, 
        canActivate: [rolGuard], 
        data: { roles: ['dueño', 'administrador', 'cajero'] } 
      },
      
      // 📦 Catálogo Global: Solo Dueño y Administrador
      { 
        path: 'productos', 
        component: ProductosComponent, 
        canActivate: [rolGuard], 
        data: { roles: ['dueño', 'administrador'] } 
      },
      
      // 👥 Control de Personal: El Dueño (Superadmin) crea Admins/Cajeros, el Admin crea Cajeros
      { 
        path: 'usuarios', 
        component: UsuariosComponent, 
        canActivate: [rolGuard], 
        data: { roles: ['dueño', 'administrador'] } 
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];