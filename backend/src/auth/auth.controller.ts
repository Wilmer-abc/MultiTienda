import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK) // Por defecto los POST devuelven 201, forzamos a 200 OK para el login
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
}