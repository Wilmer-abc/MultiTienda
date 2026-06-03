import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module'; 
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    AuthModule,
    UsuariosModule,
    ProductosModule, 
    VentasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}