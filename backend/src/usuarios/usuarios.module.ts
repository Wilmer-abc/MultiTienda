import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaModule } from '../prisma/prisma.module';   

@Module({
  imports: [PrismaModule], 
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService], // Exportamos el servicio para que pueda ser usado en otros módulos (como AuthModule)
})
export class UsuariosModule {}