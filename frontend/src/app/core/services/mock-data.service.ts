import { Injectable } from '@angular/core';

export interface User {
  email: string;
  role: 'SUPERADMIN' | 'DUENO' | 'CAJERO';
  name: string;
  contrasena: string;
  sucursal?: string;
  // Propiedades de compatibilidad para componentes antiguos
  rol?: string;
  tienda_id?: number;
  empresa_id?: number;
}

export interface Product {
  codigo_barras: string;
  nombre: string;
  categoria: string;
  imagen: string;
  stock_minimo: number;
  precio_costo: number;
  precio_venta: number;
  stock_por_sucursal: { [sucursal: string]: number };
}

export interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  fecha_creacion: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  empresa_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  // Usuarios y Roles de Prueba
  readonly USERS_MOCK: User[] = [
    { 
      email: 'superadmin@multitienda.com', 
      role: 'SUPERADMIN', 
      name: 'Edvin (Global)', 
      contrasena: 'superadmin123' 
    },
    { 
      email: 'dueno@elahorro.com', 
      role: 'DUENO', 
      name: 'Propietario El Ahorro', 
      contrasena: 'password123' 
    },
    { 
      email: 'cajerozona14@elahorro.com', 
      role: 'CAJERO', 
      name: 'Cajero Z.14', 
      contrasena: 'password123', 
      sucursal: 'Zona 14' 
    }
  ];

  // Catálogo de Productos con Stock por Sucursal
  readonly PRODUCTS_MOCK: Product[] = [
    {
      codigo_barras: '7501055311234',
      nombre: 'Soda en Lata 354ml',
      categoria: 'Bebidas',
      imagen: 'https://placehold.co/150x150/png?text=Soda',
      stock_minimo: 15,
      precio_costo: 3.50,
      precio_venta: 6.00,
      stock_por_sucursal: { 'Zona 14': 20, 'Zona 10': 5 }
    },
    {
      codigo_barras: '7401005123456',
      nombre: 'Snack de Papas Fritas',
      categoria: 'Abarrotes',
      imagen: 'https://placehold.co/150x150/png?text=Papas',
      stock_minimo: 10,
      precio_costo: 4.00,
      precio_venta: 8.00,
      stock_por_sucursal: { 'Zona 14': 8, 'Zona 10': 15 }
    }
  ];

  // Empresas de prueba
  readonly EMPRESAS_MOCK: Empresa[] = [
    {
      id: '1',
      nombre: 'El Ahorro',
      nit: '900123456-1',
      fecha_creacion: '2024-01-15'
    }
  ];

  // Sucursales de prueba
  readonly SUCURSALES_MOCK: Sucursal[] = [
    {
      id: '1',
      nombre: 'Zona 14',
      direccion: 'Av. La Reforma 14-55',
      empresa_id: '1'
    },
    {
      id: '2',
      nombre: 'Zona 10',
      direccion: 'Centro Comercial 10-20',
      empresa_id: '1'
    }
  ];

  constructor() {}
}
