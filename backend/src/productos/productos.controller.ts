import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('api/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // Endpoint de health check
  @Get('health')
  async healthCheck() {
    return { status: 'OK', timestamp: new Date().toISOString() };
  }

  @Post('crear')
  async crearNuevoProducto(@Body() infoProducto: any) {
    return this.productosService.insertarEnBaseDatos(infoProducto);
  }

  @Get('verificar/:codigo')
  async verificarCodigoBarra(@Param('codigo') codigo: string) {
    return this.productosService.verificarCodigoBarra(codigo);
  }
}