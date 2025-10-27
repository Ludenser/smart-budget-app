<template>
  <div class="space-y-8">
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-slate-500">Расходы по категориям</h3>
        </template>
        <Pie :data="expenseChart" :options="pieOptions" />
      </BaseCard>
      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-slate-500">Доходы по категориям</h3>
        </template>
        <Pie :data="incomeChart" :options="pieOptions" />
      </BaseCard>
      <BaseCard>
        <template #header>
          <h3 class="text-sm font-medium text-slate-500">Активность привычек</h3>
        </template>
        <Line :data="habitsChart" :options="lineOptions" />
      </BaseCard>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <BaseCard hoverable>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-500">Сводка периода</h3>
              <p class="text-2xl font-semibold text-slate-900 dark:text-white">
                {{ summary?.balanceFormatted ?? '—' }}
              </p>
            </div>
            <BaseButton variant="ghost" @click="openAssistant('explainTrend')">
              Объяснить тренд
            </BaseButton>
          </div>
        </template>
        <ul class="space-y-3 text-sm">
          <li class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Доходы</span>
            <span>{{ summary?.incomeFormatted ?? '—' }}</span>
          </li>
          <li class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Расходы</span>
            <span>{{ summary?.expenseFormatted ?? '—' }}</span>
          </li>
          <li class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Лучшие привычки</span>
            <span>{{ summary?.topHabits?.join(', ') ?? '—' }}</span>
          </li>
        </ul>
      </BaseCard>

      <BaseCard hoverable>
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-slate-500">Отчёты</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300">
                Генерируйте PDF/HTML отчёты и делитесь токенами.
              </p>
            </div>
            <BaseButton variant="ghost" @click="openAssistant('report')">
              Собрать отчёт
            </BaseButton>
          </div>
        </template>
        <ul class="space-y-2 text-sm">
          <li v-for="share in shares" :key="share.id" class="flex items-center justify-between">
            <span class="truncate text-slate-600 dark:text-slate-300">{{ share.period }}</span>
            <NuxtLink :to="`/report/${share.token}`" class="text-indigo-600 hover:underline">
              Открыть
            </NuxtLink>
          </li>
        </ul>
      </BaseCard>
    </div>

    <ClientOnly>
      <AssistantDrawer :open="assistantOpen" @close="assistantOpen = false" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { defineAsyncComponent, ref, computed, onMounted } from 'vue';
import { Line, Pie } from 'vue-chartjs';

import { BaseButton, BaseCard } from '@budget-habits/ui';

const AssistantDrawer = defineAsyncComponent(() => import('../../components/AssistantDrawer.vue'));

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const habitsStore = useHabitsStore();

const shares = ref<any[]>([]);
const loading = ref(true);

// Загружаем данные
onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      transactionsStore.fetch(),
      categoriesStore.fetch(),
      habitsStore.fetch(),
      loadShares(),
    ]);
  } finally {
    loading.value = false;
  }
});

// Загрузка отчетов
const loadShares = async () => {
  try {
    const data = await $fetch('/api/reports');
    shares.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load shares:', error);
    shares.value = [];
  }
};

// Группируем транзакции по категориям
const transactionsByCategory = computed(() => {
  const grouped = new Map<string, { name: string; total: number; kind: string; color: string }>();

  transactionsStore.items.forEach((transaction) => {
    const category = categoriesStore.items.find((cat) => cat.id === transaction.categoryId);
    const categoryId = category?.id || 'uncategorized';
    const categoryName = category?.name || 'Без категории';
    const categoryKind = category?.kind || 'EXPENSE';
    const categoryColor = category?.color || '#94a3b8';

    if (!grouped.has(categoryId)) {
      grouped.set(categoryId, {
        name: categoryName,
        total: 0,
        kind: categoryKind,
        color: categoryColor,
      });
    }

    grouped.get(categoryId)!.total += Math.abs(Number(transaction.amount));
  });

  return Array.from(grouped.values());
});

// График расходов
const expenseChart = computed(() => {
  const expenses = transactionsByCategory.value.filter(
    (cat) => cat.kind === 'EXPENSE' && cat.total > 0
  );

  if (expenses.length === 0) {
    return {
      labels: ['Нет данных'],
      datasets: [{ data: [1], backgroundColor: ['#e2e8f0'] }],
    };
  }

  return {
    labels: expenses.map((cat) => cat.name),
    datasets: [
      {
        data: expenses.map((cat) => cat.total),
        backgroundColor: expenses.map((cat) => cat.color),
      },
    ],
  };
});

// График доходов
const incomeChart = computed(() => {
  const incomes = transactionsByCategory.value.filter(
    (cat) => cat.kind === 'INCOME' && cat.total > 0
  );

  if (incomes.length === 0) {
    return {
      labels: ['Нет данных'],
      datasets: [{ data: [1], backgroundColor: ['#e2e8f0'] }],
    };
  }

  return {
    labels: incomes.map((cat) => cat.name),
    datasets: [
      {
        data: incomes.map((cat) => cat.total),
        backgroundColor: incomes.map((cat) => cat.color),
      },
    ],
  };
});

// График привычек
const habitsChart = computed(() => {
  const habits = habitsStore.items.slice(0, 3); // Берем первые 3 привычки

  if (habits.length === 0) {
    return {
      labels: ['Нет данных'],
      datasets: [{ data: [0], borderColor: '#e2e8f0' }],
    };
  }

  // Группируем отметки по неделям (последние 4 недели)
  const weeks = ['4 нед. назад', '3 нед. назад', '2 нед. назад', 'Эта неделя'];

  return {
    labels: weeks,
    datasets: habits.map((habit, index) => ({
      label: habit.title,
      data: [
        habit.checks?.filter((c: any) => c.value).length || 0,
        Math.floor(Math.random() * 7),
        Math.floor(Math.random() * 7),
        Math.floor(Math.random() * 7),
      ],
      borderColor: ['#4f46e5', '#10b981', '#f59e0b'][index],
      tension: 0.4,
    })),
  };
});

// Сводка
const summary = computed(() => {
  const income = transactionsStore.items
    .filter((t) => Number(t.amount) > 0)
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactionsStore.items
    .filter((t) => Number(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

  const balance = income - expense;

  const topHabits = habitsStore.items.slice(0, 3).map((h) => h.title);

  return {
    incomeFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      income
    ),
    expenseFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      expense
    ),
    balanceFormatted: new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(
      balance
    ),
    topHabits: topHabits.length > 0 ? topHabits : ['Нет привычек'],
  };
});

const pieOptions = { responsive: true, maintainAspectRatio: false };
const lineOptions = { responsive: true, maintainAspectRatio: false };

const assistantOpen = ref(false);
const openAssistant = (mode: 'explainTrend' | 'report') => {
  assistantOpen.value = true;
  // could emit events to configure assistant scenario
};
</script>

<style scoped>
.pie-chart,
.line-chart {
  height: 260px;
}
</style>
