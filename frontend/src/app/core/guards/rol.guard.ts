import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificamos si hay sesión activa
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const usuarioLogueado = authService.getCurrentUser();

  if (!usuarioLogueado) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Extraemos el rol permitido de la ruta
  const rolPermitido = route.data['rol'] as string;

  // 3. Validamos si el rol del usuario tiene permiso
  if (rolPermitido && usuarioLogueado.role === rolPermitido) {
    return true;
  }

  // Si no tiene permiso, redirigir a login
  router.navigate(['/login']);
  return false;
};