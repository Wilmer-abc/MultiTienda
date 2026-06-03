import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  async crearVenta(empresaId: number, usuarioId: number, data: any) {
    // data.carrito contiene los productos vendidos
    // data.metodo_pago contiene el método de pago
    
    // Obtenemos la tienda principal de la empresa (mockeado temporalmente si no se pasa tienda_id)
    const tienda = await this.prisma.tiendas.findFirst({
      where: { empresa_id: empresaId }
    });

    if (!tienda) {
      throw new Error('No se encontró una tienda asignada a esta empresa');
    }

    const totalVenta = data.carrito.reduce((sum: number, item: any) => sum + (item.precio_venta_base * item.cantidad), 0);

    // Usamos una Transacción para asegurar la integridad
    return this.prisma.$transaction(async (tx) => {
      // 1. Crear el registro maestro de la Venta
      const nuevaVenta = await tx.ventas.create({
        data: {
          tienda_id: tienda.id,
          usuario_id: usuarioId,
          total: totalVenta,
          metodo_pago: 'efectivo' // data.metodo_pago || 'efectivo'
        }
      });

      // 2. Crear los detalles y descontar inventario
      for (const item of data.carrito) {
        // Crear detalle
        await tx.detalle_ventas.create({
          data: {
            venta_id: nuevaVenta.id,
            producto_id: item.id,
            cantidad: item.cantidad,
            precio_unitario: item.precio_venta_base,
            subtotal: item.precio_venta_base * item.cantidad
          }
        });

        // Descontar inventario (Upsert por si no existía el registro de inventario)
        const inventarioActual = await tx.inventarios.findFirst({
          where: { tienda_id: tienda.id, producto_id: item.id }
        });

        if (inventarioActual) {
          await tx.inventarios.update({
            where: { id: inventarioActual.id },
            data: { stock: { decrement: item.cantidad } }
          });
        } else {
          // Si no existía, lo creamos con stock negativo o 0 (idealmente no debería pasar)
          await tx.inventarios.create({
            data: {
              tienda_id: tienda.id,
              producto_id: item.id,
              stock: -item.cantidad
            }
          });
        }
      }

      return nuevaVenta;
    });
  }
}
