import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ProductosModule } from './productos/productos.module'; 

@Module({
  imports: [
    AuthModule,
    UsuariosModule,
    ProductosModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}