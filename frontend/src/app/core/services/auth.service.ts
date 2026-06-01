import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL de tu backend de NestJS
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // 1. Método para hacer Login
  login(credenciales: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        // Si el backend nos responde con éxito, guardamos el Token y la info del usuario
        if (res && res.access_token) {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
        }
      })
    );
  }

  // 2. Método para cerrar sesión (Limpieza)
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('usuario');
  }

  // 3. Obtener el Token guardado
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // 4. Obtener los datos del usuario logueado (saber si es cajero o administrador)
  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // 5. Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // 6. Verificar si tiene un rol específico (Útil para proteger vistas del cajero)
  hasRole(rol: string): boolean {
    const usuario = this.getUsuario();
    return usuario && usuario.rol === rol;
  }
}