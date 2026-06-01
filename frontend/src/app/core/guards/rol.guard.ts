import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const rolGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificamos si hay sesión activa
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Extraemos los roles permitidos para esta ruta específica desde el mapa de rutas
  const rolesPermitidos = route.data['roles'] as Array<string>;
  const usuarioLogueado = authService.getUsuario();

  // 3. Validamos si el rol del usuario de la base de datos tiene permiso
  if (rolesPermitidos && rolesPermitidos.includes(usuarioLogueado.rol)) {
    return true; // ¡Pase adelante, ingeniero!
  }

  // Si no tiene permiso, lo mandamos a su sección segura por defecto
  alert('⚠️ No tienes permisos para acceder a este módulo.');
  if (usuarioLogueado.rol === 'cajero') {
    router.navigate(['/dashboard/ventas']);
  } else {
    router.navigate(['/dashboard']);
  }
  return false;
};