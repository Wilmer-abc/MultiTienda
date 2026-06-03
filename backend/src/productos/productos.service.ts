import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async verificarCodigoBarra(codigo: string, empresaId: number) {
    console.log(`🔍 Verificando código de barra: ${codigo} para la empresa ${empresaId}`);
    
    try {
      // Agregamos un timeout manual de 5 segundos
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de 5 segundos')), 5000);
      });

      // Ahora usamos findFirst porque codigo_barra ya no es unique global, sino por empresa
      const queryPromise = this.prisma.productos.findFirst({
        where: { 
          codigo_barra: codigo,
          empresa_id: empresaId 
        }
      });

      // Carrera entre el timeout y la consulta
      const existe = await Promise.race([queryPromise, timeoutPromise]) as any;

      console.log('✅ Consulta completada. ¿Existe?', !!existe);

      if (existe) {
        throw new ConflictException({
          message: `El código de barras ${codigo} ya está registrado en el sistema para esta empresa.`,
          producto: existe
        });
      }

      // ---------------------------------------------------------
      // INTEGRACIÓN: API Pública de Autocompletado (Open Food Facts)
      // ---------------------------------------------------------
      console.log(`🌐 Buscando código ${codigo} en Open Food Facts...`);
      let productoSugerido: any = null; // Fix TS type
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigo}.json`);
        const data = await response.json();
        
        if (data.status === 1 && data.product) {
          productoSugerido = {
            nombre: data.product.product_name || data.product.generic_name || '',
            descripcion: data.product.categories || '',
            imagen_url: data.product.image_url || null
          };
          console.log('✅ Producto encontrado globalmente:', productoSugerido?.nombre);
        } else {
          console.log('⚠️ Producto no encontrado en APIs globales.');
        }
      } catch (err) {
        console.error('⚠️ Error consultando API externa (Open Food Facts):', err.message);
        // No lanzamos error para no bloquear el flujo si la API externa cae
      }

      return {
        disponible: true,
        message: `El código ${codigo} está disponible para registro.`,
        sugerencia: productoSugerido
      };

    } catch (error) {
      console.error('❌ Error en verificación:', error);
      
      if (error instanceof Error && error.message === 'Timeout de 5 segundos') {
        throw new InternalServerErrorException('La base de datos no responde. Verifica que MySQL esté corriendo.');
      }
      
      throw error;
    }
  }

  async insertarEnBaseDatos(productoDto: any, empresaId: number) {
    console.log(`📦 Insertando producto para empresa ${empresaId}:`, productoDto);

    try {
      // Timeout para la inserción también
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout de 10 segundos')), 10000);
      });

      // 1. Validar duplicados por empresa
      const existePromise = this.prisma.productos.findFirst({
        where: { 
          codigo_barra: productoDto.codigo_barra,
          empresa_id: empresaId
        }
      });

      const existe = await Promise.race([existePromise, timeoutPromise]) as any;

      if (existe) {
        throw new ConflictException({
          message: `El código de barras ${productoDto.codigo_barra} ya está registrado en tu empresa.`,
          producto: existe
        });
      }

      // 2. Ejecutar el INSERT con el empresa_id inyectado
      const createPromise = this.prisma.productos.create({
        data: {
          empresa_id: empresaId,
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
        mensaje: 'Producto insertado exitosamente.',
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

  async obtenerProductosPaginados(empresaId: number, skip: number, take: number) {
    console.log(`Paginando productos empresa ${empresaId} (Skip: ${skip}, Take: ${take})`);
    const [productos, total] = await Promise.all([
      this.prisma.productos.findMany({
        where: { empresa_id: empresaId },
        skip,
        take,
        orderBy: { nombre: 'asc' }
      }),
      this.prisma.productos.count({
        where: { empresa_id: empresaId }
      })
    ]);

    return {
      productos,
      total,
      hasMore: (skip + take) < total
    };
  }
}