import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';

@Controller('api/ventas')
@UseGuards(JwtAuthGuard)
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('cobrar')
  async cobrarVenta(@Body() data: any, @GetUser() user: any) {
    // user.empresaId y user.userId vienen del token
    return this.ventasService.crearVenta(user.empresaId, user.userId, data);
  }
}
