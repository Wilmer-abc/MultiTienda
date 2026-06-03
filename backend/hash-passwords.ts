// hash-passwords.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  try {
    // Obtener todos los usuarios
    const usuarios = await prisma.usuarios.findMany();

    for (const usuario of usuarios) {
      // Si la contraseña NO parece un hash de bcrypt (no empieza con $2b$)
      if (!usuario.password.startsWith('$2b$')) {
        console.log(`Hasheando contraseña para: ${usuario.correo} (${usuario.rol})`);

        const hashedPassword = await bcrypt.hash(usuario.password, 10);

        await prisma.usuarios.update({
          where: { id: usuario.id },
          data: { password: hashedPassword }
        });

        console.log(`✓ Contraseña actualizada para ${usuario.correo}`);
      } else {
        console.log(`✓ ${usuario.correo} ya tiene contraseña hasheada correctamente`);
      }
    }

    console.log('✅ Proceso completado');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

hashExistingPasswords();