import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'id');
  if (!token) throw createError({ statusCode: 400, statusMessage: 'Token required' });

  const share = await prisma.reportShare.findUnique({ where: { token } });
  if (!share) throw createError({ statusCode: 404, statusMessage: 'Report not found' });

  // Получаем транзакции пользователя
  const transactions = await prisma.transaction.findMany({
    where: { userId: share.userId },
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  // Считаем статистику
  const income = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const balance = income - expense;

  // Группируем по категориям
  const byCategory = transactions.reduce(
    (acc, t) => {
      const name = t.category?.name || 'Без категории';
      if (!acc[name]) acc[name] = 0;
      acc[name] += Math.abs(Number(t.amount));
      return acc;
    },
    {} as Record<string, number>
  );

  const topCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(
      ([name, amount]) =>
        `- ${name}: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount)}`
    )
    .join('\n');

  // Генерируем insights
  const insights =
    transactions.length > 0
      ? `## Статистика за период "${share.period}"\n\n### Топ категорий\n${topCategories}\n\n### Анализ\n- Всего транзакций: ${transactions.length}\n- Средний расход: ${new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(expense / Math.max(transactions.filter((t) => Number(t.amount) < 0).length, 1))}`
      : '## Нет данных\n\nЗа выбранный период транзакции отсутствуют.';

  return {
    period: share.period,
    incomeFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      income
    ),
    expenseFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      expense
    ),
    balanceFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      balance
    ),
    insights,
  };
});
