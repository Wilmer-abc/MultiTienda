import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  // 1. Crear usuario con contraseña encriptada
  async create(createUsuarioDto: any) {
    try {
      // Verificar si el correo ya está registrado para evitar choques en la BD
      const existeUsuario = await this.prisma.usuarios.findUnique({
        where: { correo: createUsuarioDto.correo },
      });

      if (existeUsuario) {
        throw new BadRequestException('El correo electrónico ya está registrado.');
      }

      // Encriptar la contraseña (10 rondas de salt es el estándar de la industria)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, saltRounds);

      // Reemplazamos la contraseña plana por la encriptada antes de guardar
      const usuarioData = {
        ...createUsuarioDto,
        password: hashedPassword,
      };

      return await this.prisma.usuarios.create({
        data: usuarioData,
      });
    } catch (error) {
      throw error;
    }
  }

  // 2. Buscar usuario por correo (¡Este lo usará nuestro servicio de Login!)
  async findByEmail(correo: string) {
    return this.prisma.usuarios.findUnique({
      where: { correo: correo },
    });
  }

  // 3. Listar todos los usuarios
  async findAll() {
    return this.prisma.usuarios.findMany();
  }

  // 4. Buscar un usuario por ID
  async findOne(id: number) {
    return this.prisma.usuarios.findUnique({
      where: { id: id },
    });
  }

  // 5. Actualizar un usuario
  async update(id: number, updateUsuarioDto: any) {
    // Si el DTO incluye contraseña, también la encriptamos al actualizar
    if (updateUsuarioDto.password) {
      const saltRounds = 10;
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, saltRounds);
    }
    
    return this.prisma.usuarios.update({
      where: { id: id },
      data: updateUsuarioDto,
    });
  }

  // 6. Eliminar un usuario
  async remove(id: number) {
    return this.prisma.usuarios.delete({
      where: { id: id },
    });
  }
}