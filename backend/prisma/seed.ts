import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seeder para SaaS MultiTienda...');

  // 1. Limpiar base de datos (Opcional, pero útil si pruebas mucho)
  await prisma.detalle_ventas.deleteMany();
  await prisma.ventas.deleteMany();
  await prisma.inventarios.deleteMany();
  await prisma.productos.deleteMany();
  await prisma.usuarios.deleteMany();
  await prisma.tiendas.deleteMany();
  await prisma.empresas.deleteMany();

  // 2. Crear un usuario Superadmin (Dueño de la plataforma SaaS)
  const superadminPassword = await bcrypt.hash('superadmin123', 10);
  await prisma.usuarios.create({
    data: {
      nombre: 'Admin de Plataforma',
      correo: 'superadmin@multitienda.com',
      password: superadminPassword,
      rol: 'superadmin',
      activo: true,
    }
  });
  console.log('✅ Creado Superadmin (superadmin@multitienda.com / superadmin123)');

  // 3. Crear una Empresa Cliente
  const empresa1 = await prisma.empresas.create({
    data: {
      nombre: 'Supermercados El Ahorro S.A.',
      identificacion_fiscal: 'NIT-123456',
      plan_contratado: 'premium',
      limite_tiendas: 5,
      activo: true,
    }
  });
  console.log(`✅ Creada Empresa Cliente: ${empresa1.nombre}`);

  // 4. Crear una Tienda para esa empresa
  const tienda1 = await prisma.tiendas.create({
    data: {
      empresa_id: empresa1.id,
      nombre: 'Sucursal Zona 14',
      direccion: '10ma Avenida, Zona 14, Guatemala',
      telefono: '5555-1234'
    }
  });

  // 5. Crear usuarios para la empresa (Dueño, Admin, Cajero)
  const passwordGenerico = await bcrypt.hash('password123', 10);

  await prisma.usuarios.createMany({
    data: [
      {
        empresa_id: empresa1.id,
        tienda_id: null, // El dueño ve todas las tiendas de su empresa
        nombre: 'Carlos (Dueño Empresa)',
        correo: 'dueno@elahorro.com',
        password: passwordGenerico,
        rol: 'due_o',
        activo: true,
      },
      {
        empresa_id: empresa1.id,
        tienda_id: tienda1.id, // Admin asignado a una tienda específica
        nombre: 'María (Admin Zona 14)',
        correo: 'adminzona14@elahorro.com',
        password: passwordGenerico,
        rol: 'administrador',
        activo: true,
      },
      {
        empresa_id: empresa1.id,
        tienda_id: tienda1.id, // Cajero asignado a una tienda específica
        nombre: 'Juan (Cajero)',
        correo: 'cajerozona14@elahorro.com',
        password: passwordGenerico,
        rol: 'cajero',
        activo: true,
      }
    ]
  });

  console.log('✅ Creados Dueño, Admin y Cajero (Contraseña para todos: password123)');
  console.log('🏁 Seeder completado con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
