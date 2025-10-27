import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Создаем демо пользователя
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'demo@example.com',
      name: 'Demo User',
    },
  });

  console.log('✅ Demo user created:', demoUser);

  // Создаем несколько демо категорий
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      update: {},
      create: {
        id: '11111111-1111-1111-1111-111111111111',
        userId: demoUser.id,
        name: 'Продукты',
        kind: 'EXPENSE',
        color: '#ef4444',
      },
    }),
    prisma.category.upsert({
      where: { id: '22222222-2222-2222-2222-222222222222' },
      update: {},
      create: {
        id: '22222222-2222-2222-2222-222222222222',
        userId: demoUser.id,
        name: 'Транспорт',
        kind: 'EXPENSE',
        color: '#3b82f6',
      },
    }),
    prisma.category.upsert({
      where: { id: '33333333-3333-3333-3333-333333333333' },
      update: {},
      create: {
        id: '33333333-3333-3333-3333-333333333333',
        userId: demoUser.id,
        name: 'Зарплата',
        kind: 'INCOME',
        color: '#10b981',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
