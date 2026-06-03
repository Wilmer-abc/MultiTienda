import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'CLAVE_SECRETA_ULTRA_SEGURA_MAZATENANGO', // Idealmente usar env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    // Este objeto estará disponible en request.user
    return { 
      id: payload.sub, 
      correo: payload.correo, 
      rol: payload.rol,
      tiendaId: payload.tiendaId,
      empresaId: payload.empresaId 
    };
  }
}
