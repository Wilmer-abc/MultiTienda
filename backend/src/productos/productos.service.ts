import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async verificarCodigoBarra(codigo: string) {
    console.log('🔍 Verificando código de barra:', codigo);
    
    try {
      // Agregamos un timeout manual de 5 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de 5 segundos')), 5000);
      });

      const queryPromise = this.prisma.productos.findUnique({
        where: { codigo_barra: codigo }
      });

      // Carrera entre el timeout y la consulta
      const existe = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('✅ Consulta completada. ¿Existe?', !!existe);

      if (existe) {
        throw new ConflictException({
          message: `El código de barras ${codigo} ya está registrado en el sistema.`,
          producto: existe
        });
      }

      return {
        disponible: true,
        message: `El código ${codigo} está disponible para registro.`
      };

    } catch (error) {
      console.error('❌ Error en verificación:', error);
      
      if (error instanceof Error && error.message === 'Timeout de 5 segundos') {
        throw new InternalServerErrorException('La base de datos no responde. Verifica que MySQL esté corriendo.');
      }
      
      throw error;
    }
  }

  async insertarEnBaseDatos(productoDto: any) {
    console.log('📦 Datos recibidos desde Angular:', productoDto);

    try {
      // Timeout para la inserción también
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de 10 segundos')), 10000);
      });

      // 1. Validar duplicados
      const existePromise = this.prisma.productos.findUnique({
        where: { codigo_barra: productoDto.codigo_barra }
      });

      const existe = await Promise.race([existePromise, timeoutPromise]) as any;

      if (existe) {
        throw new ConflictException({
          message: `El código de barras ${productoDto.codigo_barra} ya está registrado.`,
          producto: existe
        });
      }

      // 2. Ejecutar el INSERT
      const createPromise = this.prisma.productos.create({
        data: {
          codigo_barra: productoDto.codigo_barra,
          nombre: productoDto.nombre,
          descripcion: productoDto.descripcion || null,
          imagen_url: productoDto.imagen_url || null,
          precio_costo_base: parseFloat(productoDto.precio_costo_base),
          precio_venta_base: parseFloat(productoDto.precio_venta_base),
        }
      });

      const nuevoProducto = await Promise.race([createPromise, timeoutPromise]) as any;

      console.log('✅ Producto insertado exitosamente');

      return {
        OK: true,
        mensaje: 'Producto insertado exitosamente en la Base de Datos Global de MySQL.',
        producto: nuevoProducto
      };

    } catch (error) {
      console.error('❌ Error en Prisma al insertar producto:', error);
      
      if (error instanceof Error && error.message === 'Timeout de 10 segundos') {
        throw new InternalServerErrorException('La operación tardó demasiado. Verifica la conexión a MySQL.');
      }
      
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error interno al ejecutar el query en MySQL.');
    }
  }
}