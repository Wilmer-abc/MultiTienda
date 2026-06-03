import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) { }

  async login(loginDto: any) {
    const { correo, password } = loginDto;

    // 1. Buscar al usuario por correo
    const usuario = await this.usuariosService.findByEmail(correo);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas (Correo no encontrado).');
    }

    // 2. Verificar si el usuario está activo
    if (!usuario.activo) {
      throw new UnauthorizedException('Este usuario se encuentra inactivo. Comunícate con soporte.');
    }

    // 3. Comparar la contraseña ingresada con la encriptada en la BD
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales incorrectas (Contraseña inválida).');
    }

    // 4. Preparar la información (Payload) que viajará oculta dentro del JWT
    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      tiendaId: usuario.tienda_id,
      empresaId: usuario.empresa_id,
    };

    // 5. Firmar el Token y devolverlo junto con los datos públicos del usuario
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        tiendaId: usuario.tienda_id,
        empresaId: usuario.empresa_id,
      },
    };
  }
}