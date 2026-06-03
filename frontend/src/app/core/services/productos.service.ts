import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductoMySQL {
  codigo_barra: string;
  nombre: string;
  descripcion: string;
  imagen_url: string;
  precio_costo_base: number | null;
  precio_venta_base: number | null;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private urlAPI = '/api/productos/crear';

  constructor(private http: HttpClient) {}

  guardarEnBackend(producto: any): Observable<any> {
    return this.http.post(this.urlAPI, producto);
  }

  verificarCodigoBarra(codigo: string): Observable<any> {
    return this.http.get(`/api/productos/verificar/${codigo}`);
  }

  registrarVenta(datosVenta: any): Observable<any> {
    return this.http.post('/api/ventas/cobrar', datosVenta);
  }
}
