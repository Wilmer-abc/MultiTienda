import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MockDataService, User } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private mockDataService: MockDataService) {
    // Recuperar sesión del localStorage al iniciar
    const savedUser = localStorage.getItem('usuario');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, contrasena: string): { success: boolean; user?: User; error?: string } {
    const user = this.mockDataService.USERS_MOCK.find(
      u => u.email === email && u.contrasena === contrasena
    );

    if (user) {
      this.currentUserSubject.next(user);
      localStorage.setItem('usuario', JSON.stringify(user));
      return { success: true, user };
    }

    return { success: false, error: 'Credenciales inválidas' };
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('usuario');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  getCurrentUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  getSucursal(): string | null {
    const user = this.getCurrentUser();
    return user && user.sucursal ? user.sucursal : null;
  }

  // Métodos de compatibilidad para componentes antiguos
  getUsuario(): User | null {
    return this.getCurrentUser();
  }

  getToken(): string | null {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }
}