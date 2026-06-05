import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { rolGuard } from './core/guards/rol.guard';
import { SUPERADMIN_ROUTES } from './pages/superadmin/superadmin.routes';
import { DUENO_ROUTES } from './pages/dueno/dueno.routes';
import { CAJERO_ROUTES } from './pages/cajero/cajero.routes';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'superadmin',
        canActivate: [rolGuard],
        data: { rol: 'SUPERADMIN' },
        children: SUPERADMIN_ROUTES
      },
      {
        path: 'dueno',
        canActivate: [rolGuard],
        data: { rol: 'DUENO' },
        children: DUENO_ROUTES
      },
      {
        path: 'cajero',
        canActivate: [rolGuard],
        data: { rol: 'CAJERO' },
        children: CAJERO_ROUTES
      }
    ]
  },

  { path: '**', redirectTo: 'login' }
];