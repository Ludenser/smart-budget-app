<template>
  <div class="grid gap-8 md:grid-cols-2">
    <BaseCard>
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Профиль</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Обновите персональные данные, таймзону и тему.
        </p>
      </template>
      <form class="mt-4 space-y-4" @submit.prevent="savePreferences">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >Таймзона</label
          >
          <input
            v-model="preferences.timezone"
            type="text"
            placeholder="Europe/Moscow"
            class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
          />
        </div>
        <BaseButton type="submit">Сохранить</BaseButton>
      </form>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Публичные отчёты</h2>
        <p class="text-sm text-slate-600 dark:text-slate-300">
          Генерируйте токен для публичного доступа к отчёту и управляйте существующими ссылками.
        </p>
      </template>
      <div class="mt-4 space-y-4">
        <BaseButton block :disabled="loading" @click="createShare">
          {{ loading ? 'Загрузка...' : 'Сделать публичный отчёт' }}
        </BaseButton>

        <div
          v-if="shares.length === 0 && !loading"
          class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-800"
        >
          <p class="text-sm text-slate-600 dark:text-slate-400">У вас пока нет публичных отчетов</p>
        </div>

        <ul v-else class="space-y-2 text-sm">
          <li
            v-for="share in shares"
            :key="share.id"
            class="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-slate-700"
          >
            <div class="flex flex-col gap-1">
              <span class="font-mono text-xs text-slate-600 dark:text-slate-400">{{
                share.token
              }}</span>
              <span class="text-xs text-slate-500">{{ share.period }}</span>
            </div>
            <div class="flex items-center gap-2">
              <NuxtLink :to="`/report/${share.token}`" class="text-indigo-600 hover:underline"
                >Открыть</NuxtLink
              >
              <button class="text-rose-500 hover:underline" @click="revoke(share.id)">
                Отозвать
              </button>
            </div>
          </li>
        </ul>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { BaseButton, BaseCard } from '@budget-habits/ui';

const preferences = usePreferencesStore();
const shares = ref<Array<{ id: string; token: string; period: string }>>([]);
const loading = ref(false);

// Загружаем shares при монтировании
onMounted(async () => {
  await loadShares();
});

const loadShares = async () => {
  loading.value = true;
  try {
    const data = await $fetch('/api/reports');
    shares.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load shares:', error);
    shares.value = [];
  } finally {
    loading.value = false;
  }
};

const savePreferences = () => {
  preferences.setTimezone(preferences.timezone);
};

const createShare = async () => {
  try {
    loading.value = true;
    const result = await $fetch('/api/share', {
      method: 'POST',
      body: { period: 'current-month' },
    });
    console.log('Created share:', result);
    // Перезагружаем весь список с сервера
    await loadShares();
  } catch (error) {
    console.error('Failed to create share:', error);
    alert('Ошибка при создании отчета');
  }
};

const revoke = async (id: string) => {
  try {
    await $fetch(`/api/share/${id}`, { method: 'DELETE' });
    // Перезагружаем список с сервера
    await loadShares();
  } catch (error) {
    console.error('Failed to revoke share:', error);
    alert('Ошибка при удалении отчета');
  }
};
</script>
