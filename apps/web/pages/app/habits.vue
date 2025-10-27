<template>
  <div class="space-y-6">
    <!-- Объяснение раздела привычек -->
    <section
      class="rounded-xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20"
    >
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900"
          >
            <span class="text-2xl">🎯</span>
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Что такое привычки?
          </h2>
          <p class="mt-2 text-sm text-blue-700 dark:text-blue-300">
            Привычки — это ежедневные действия, которые вы хотите делать регулярно. Отслеживание
            привычек помогает формировать полезные навыки и избавляться от вредных.
          </p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <div
          class="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-700 dark:bg-blue-900/10"
        >
          <h3 class="font-semibold text-blue-900 dark:text-blue-100">🔥 Что такое серия?</h3>
          <p class="mt-2 text-sm text-blue-700 dark:text-blue-300">
            <strong>Серия</strong> — это количество дней подряд, когда вы выполняли привычку.
            Например, если вы делали зарядку 5 дней подряд, ваша серия = 5.
          </p>
          <div class="mt-3 text-xs text-blue-600 dark:text-blue-400">
            💡 <strong>Совет:</strong> Не прерывайте серию! Даже один пропущенный день обнуляет
            счетчик.
          </div>
        </div>

        <div
          class="rounded-lg border border-blue-200 bg-white p-4 dark:border-blue-700 dark:bg-blue-900/10"
        >
          <h3 class="font-semibold text-blue-900 dark:text-blue-100">📅 Как использовать?</h3>
          <ul class="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• <strong>Создайте привычку</strong> — нажмите "Новая привычка"</li>
            <li>• <strong>Отмечайте дни</strong> — кликайте на числа в календаре</li>
            <li>• <strong>Следите за серией</strong> — бейдж показывает текущую серию</li>
            <li>• <strong>Не пропускайте</strong> — каждый день важен для серии</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Основной раздел привычек -->
    <section
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <header class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Мои привычки</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Отслеживайте ежедневные чек-ины, стройте серию.
          </p>
        </div>
        <BaseButton @click="addHabit">Новая привычка</BaseButton>
      </header>

      <div v-if="habitsStore.loading" class="mt-6 flex justify-center">
        <div
          class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
        ></div>
      </div>

      <div v-else-if="habitsStore.items.length === 0" class="mt-6 space-y-6">
        <!-- Заглушка -->
        <div
          class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-600 dark:bg-slate-800"
        >
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
          >
            <span class="text-3xl">🎯</span>
          </div>
          <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-300">
            У вас пока нет привычек
          </h3>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Создайте первую привычку, чтобы начать отслеживать свой прогресс
          </p>
          <BaseButton class="mt-4" @click="addHabit">Создать первую привычку</BaseButton>
        </div>

        <!-- Примеры популярных привычек -->
        <div
          class="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800"
        >
          <h3 class="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
            💡 Популярные привычки для начала
          </h3>
          <div class="grid gap-3 md:grid-cols-2">
            <div
              class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-700"
            >
              <h4 class="font-semibold text-slate-800 dark:text-slate-200">🏃‍♂️ Здоровье</h4>
              <ul class="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Зарядка 10 минут</li>
                <li>• Пить 2 литра воды</li>
                <li>• Спать 8 часов</li>
                <li>• Медитация 5 минут</li>
              </ul>
            </div>
            <div
              class="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-600 dark:bg-slate-700"
            >
              <h4 class="font-semibold text-slate-800 dark:text-slate-200">📚 Развитие</h4>
              <ul class="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                <li>• Читать 20 страниц</li>
                <li>• Изучать язык 15 минут</li>
                <li>• Писать в дневник</li>
                <li>• Изучать новую тему</li>
              </ul>
            </div>
          </div>
          <div class="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              <strong>💡 Совет:</strong> Начните с 1-2 простых привычек. Лучше делать мало, но
              регулярно, чем много, но непостоянно.
            </p>
          </div>
        </div>
      </div>

      <div v-else class="mt-6 grid gap-4 md:grid-cols-2">
        <BaseCard v-for="habit in habitsStore.items" :key="habit.id" hoverable>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ habit.title }}
              </h3>
              <div class="flex items-center gap-2">
                <span
                  class="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
                >
                  🔥 {{ streak(habit.checks) }}
                </span>
                <span class="text-xs text-slate-500 dark:text-slate-400">дней</span>
              </div>
            </div>
            <div class="mt-2 text-xs text-slate-600 dark:text-slate-400">
              💡 Кликайте на числа, чтобы отметить выполнение привычки
            </div>
          </template>

          <!-- Календарь недели -->
          <div class="space-y-3">
            <div class="grid grid-cols-7 gap-2">
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Пн
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Вт
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Ср
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Чт
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Пт
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Сб
              </div>
              <div class="text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                Вс
              </div>
            </div>
            <div class="grid grid-cols-7 gap-2">
              <button
                v-for="day in days"
                :key="day.toISOString()"
                :class="[
                  'rounded-lg border px-3 py-2 text-xs font-semibold transition',
                  isChecked(habit, day)
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:border-emerald-400 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'border-slate-200 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-400 dark:hover:border-emerald-500 dark:hover:bg-emerald-900/20',
                ]"
                :title="`${day.toLocaleDateString('ru-RU')} - ${isChecked(habit, day) ? 'Выполнено' : 'Не выполнено'}`"
                @click="toggleCheck(habit, day)"
              >
                {{ day.getDate() }}
              </button>
            </div>
          </div>

          <!-- Статистика -->
          <div
            class="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3 dark:bg-slate-800"
          >
            <div class="text-center">
              <div class="text-lg font-bold text-slate-700 dark:text-slate-300">
                {{ habit.checks.length }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">всего дней</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {{ streak(habit.checks) }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">текущая серия</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ Math.round((habit.checks.length / 7) * 100) }}%
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">за неделю</div>
            </div>
          </div>
        </BaseCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { addDays, startOfWeek } from 'date-fns';

import { BaseButton, BaseCard } from '@budget-habits/ui';

const habitsStore = useHabitsStore();

const days = computed(() => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
});

onMounted(() => habitsStore.fetch());

const addHabit = async () => {
  const title = prompt('Название привычки');
  if (!title) return;
  try {
    await $fetch('/api/habits', { method: 'POST', body: { title } });
    await habitsStore.fetch();
  } catch (error) {
    console.error('Failed to add habit:', error);
    alert('Ошибка при создании привычки');
  }
};

const isChecked = (habit: any, day: Date) =>
  habit.checks.some((check: any) => new Date(check.date).toDateString() === day.toDateString());

const toggleCheck = async (habit: any, day: Date) => {
  try {
    const existing = habit.checks.find(
      (check: any) => new Date(check.date).toDateString() === day.toDateString()
    );
    if (existing) {
      await $fetch(`/api/habits/${habit.id}/checks/${existing.id}`, { method: 'DELETE' });
    } else {
      await $fetch(`/api/habits/${habit.id}/checks`, {
        method: 'POST',
        body: { date: day, value: true },
      });
    }
    // Ждем обновления данных
    await habitsStore.fetch();
  } catch (error) {
    console.error('Failed to toggle check:', error);
  }
};

const streak = (checks: any[]) => {
  const sorted = checks
    .map((check) => new Date(check.date))
    .sort((a, b) => b.getTime() - a.getTime());
  let count = 0;
  let cursor = new Date();
  for (const day of sorted) {
    if (day.toDateString() === cursor.toDateString()) {
      count += 1;
      cursor = addDays(cursor, -1);
    } else if (day < cursor) {
      break;
    }
  }
  return count;
};
</script>
