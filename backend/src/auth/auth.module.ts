import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsuariosModule, // <--- Importante para poder buscar los usuarios de la BD
    PassportModule,
    JwtModule.register({
      secret: 'CLAVE_SECRETA_ULTRA_SEGURA_MAZATENANGO', // En producción esto va en el .env
      signOptions: { expiresIn: '8h' }, // El token expira en 8 horas
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}