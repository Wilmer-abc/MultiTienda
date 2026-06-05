import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

export interface NavItem {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {
  currentRole: string | null = null;
  navItems: NavItem[] = [];
  activePath: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentRole = this.authService.getCurrentUserRole();
    this.loadNavItems();
    
    // Suscribirse a cambios de ruta para actualizar el item activo
    this.router.events.subscribe(() => {
      this.activePath = this.router.url;
    });
  }

  loadNavItems(): void {
    switch (this.currentRole) {
      case 'SUPERADMIN':
        this.navItems = [
          { icon: 'business', label: 'Empresas', path: '/superadmin/empresas' },
          { icon: 'add_business', label: 'Nueva Tienda', path: '/superadmin/nueva-tienda' },
          { icon: 'settings', label: 'Ajustes', path: '/superadmin/ajustes' }
        ];
        break;
      case 'DUENO':
        this.navItems = [
          { icon: 'analytics', label: 'Reportes', path: '/dueno/reportes' },
          { icon: 'warning', label: 'Alertas', path: '/dueno/alertas' },
          { icon: 'shopping_cart', label: 'Compras', path: '/dueno/compras' },
          { icon: 'people', label: 'Personal', path: '/dueno/personal' },
          { icon: 'store', label: 'Sucursales', path: '/dueno/sucursales' }
        ];
        break;
      case 'CAJERO':
        this.navItems = [
          { icon: 'point_of_sale', label: 'Vender', path: '/cajero/pos' },
          { icon: 'inventory_2', label: 'Compras', path: '/cajero/compras-local' },
          { icon: 'payments', label: 'Caja', path: '/cajero/caja' }
        ];
        break;
      default:
        this.navItems = [];
    }
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.activePath.startsWith(path);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? user.name : '';
  }
}
