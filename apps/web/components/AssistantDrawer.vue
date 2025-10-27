<template>
  <Drawer
    :open="open"
    title="AI Ассистент"
    description="Получите инсайты по вашим данным"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <BaseButton block :disabled="loading" @click="runScenario('explain')">
        📊 Объясни тренд за месяц
      </BaseButton>
      <BaseButton block variant="secondary" :disabled="loading" @click="runScenario('report')">
        📝 Собери отчёт
      </BaseButton>

      <div
        class="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900"
      >
        <h3 class="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
          Ответ ассистента
        </h3>

        <div v-if="!response && !loading" class="text-sm text-slate-500 dark:text-slate-400">
          Выберите действие выше, чтобы получить анализ
        </div>

        <div
          v-if="loading"
          class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
        >
          <div
            class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
          ></div>
          Анализирую данные...
        </div>

        <div v-if="response" class="overflow-x-auto max-h-[500px]">
          <MarkdownViewer :content="response" />
        </div>

        <div
          v-if="error"
          class="rounded-md bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
        >
          {{ error }}
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { BaseButton, Drawer, MarkdownViewer } from '@budget-habits/ui';

defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();

const loading = ref(false);
const response = ref('');
const error = ref('');

const runScenario = async (scenario: 'explain' | 'report') => {
  loading.value = true;
  response.value = '';
  error.value = '';

  try {
    // Подготавливаем данные для отправки
    const transactions = transactionsStore.items.map((t) => ({
      amount: t.amount,
      currency: t.currency,
      date: t.date,
      category: categoriesStore.items.find((c) => c.id === t.categoryId)?.name || 'Без категории',
    }));

    if (transactions.length === 0) {
      error.value = 'Нет транзакций для анализа. Создайте хотя бы одну транзакцию.';
      loading.value = false;
      return;
    }

    const endpoint =
      scenario === 'explain' ? '/api/insights/explain-trend' : '/api/insights/report';

    const payload =
      scenario === 'explain'
        ? {
            period: 'текущий месяц',
            transactions: transactions.slice(0, 20), // Последние 20
          }
        : {
            period: 'текущий период',
            transactions: transactions.slice(0, 50), // Последние 50
          };

    // Используем fetch для POST с SSE
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    if (!res.body) {
      throw new Error('No response body');
    }

    // Читаем stream
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data) {
            response.value += data;
          }
        }
      }
    }

    loading.value = false;
  } catch (err: any) {
    console.error('Assistant error:', err);
    error.value = err.message || 'Произошла ошибка при обращении к ассистенту';
    loading.value = false;
  }
};
</script>
