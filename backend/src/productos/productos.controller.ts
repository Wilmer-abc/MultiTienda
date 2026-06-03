import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';

@Controller('api/productos')
@UseGuards(JwtAuthGuard) // <--- Protege todas las rutas de este controlador
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Endpoint de health check
  @Get('health')
  async healthCheck() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Post('crear')
  async crearNuevoProducto(@Body() infoProducto: any, @GetUser() user: any) {
    // Inyectamos el empresaId del JWT
    return this.productosService.insertarEnBaseDatos(infoProducto, user.empresaId);
  }

  @Get('listar')
  async listarProductos(
    @GetUser() user: any,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10'
  ) {
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    return this.productosService.obtenerProductosPaginados(user.empresaId, skip, take);
  }

  @Get('verificar/:codigo')
  async verificarCodigoBarra(@Param('codigo') codigo: string, @GetUser() user: any) {
    // Inyectamos el empresaId del JWT
    return this.productosService.verificarCodigoBarra(codigo, user.empresaId);
  }
}