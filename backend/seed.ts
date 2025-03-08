// seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertar roles predeterminados
  await prisma.role.createMany({
    data: [
      {
        name: 'usuario',
        description: 'Rol de usuario común',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'admin',
        description: 'Rol de administrador con privilegios completos',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'superadmin',
        description: 'Rol con privilegios más altos que el admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  });

  // Insertar estados de dispositivo predeterminados
  await prisma.deviceStatus.createMany({
    data: [
      {
        name: 'activo',
        description: 'Dispositivo activo',
      },
      {
        name: 'inactivo', // Corregí el typo 'inctivo' a 'inactivo'
        description: 'Dispositivo inactivo',
      },
    ],
  });

  console.log('Roles y estados de dispositivo predeterminados insertados.');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
