<template>
  <Drawer
    :open="open"
    title="AI Ассистент"
    description="Получите инсайты по вашим данным"
    @close="$emit('close')"
  >
    <div class="flex h-full flex-col space-y-6">
      <!-- Кнопки действий -->
      <div class="flex flex-col gap-3 sm:flex-row">
        <BaseButton class="flex-1" :disabled="loading" @click="runScenario('explain')">
          <span class="flex items-center justify-center gap-2">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Объясни тренд
          </span>
        </BaseButton>
        <BaseButton
          class="flex-1"
          variant="secondary"
          :disabled="loading"
          @click="runScenario('report')"
        >
          <span class="flex items-center justify-center gap-2">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Собери отчёт
          </span>
        </BaseButton>
      </div>

      <!-- Ответ ассистента -->
      <div
        class="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div
          class="border-b border-slate-200 bg-slate-50 px-5 py-3 dark:border-slate-700 dark:bg-slate-800/50"
        >
          <h3
            class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Ответ ассистента
          </h3>
        </div>

        <div class="flex-1 overflow-y-auto overflow-x-hidden px-5 py-4 scrollbar-thin">
          <div
            v-if="!response && !loading"
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <div class="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <svg
                class="h-8 w-8 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Выберите действие выше, чтобы получить анализ
            </p>
          </div>

          <div v-if="loading" class="flex flex-col items-center justify-center gap-4 py-12">
            <div
              class="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-900 dark:border-t-indigo-500"
            ></div>
            <p class="text-sm font-medium text-slate-600 dark:text-slate-400">
              Анализирую данные...
            </p>
          </div>

          <div v-if="response" class="response-content max-w-full">
            <div class="mb-3 flex items-center justify-between">
              <button
                class="rounded-md bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                @click="showRaw = !showRaw"
              >
                {{ showRaw ? '📝 Показать форматированный' : '🔍 Показать сырой текст' }}
              </button>
            </div>

            <div
              v-if="showRaw"
              class="max-h-[600px] overflow-y-auto rounded-lg bg-slate-100 p-4 scrollbar-thin dark:bg-slate-800"
            >
              <pre
                class="whitespace-pre-wrap break-words text-xs text-slate-800 dark:text-slate-200"
                >{{ response }}</pre
              >
            </div>
            <MarkdownViewer v-else :content="response" />
          </div>

          <div
            v-if="error"
            class="rounded-lg border border-rose-200 bg-rose-50 p-4 dark:border-rose-800 dark:bg-rose-900/20"
          >
            <div class="flex gap-3">
              <svg
                class="h-5 w-5 flex-shrink-0 text-rose-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-sm text-rose-700 dark:text-rose-300">{{ error }}</p>
            </div>
          </div>
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

const showRaw = ref(false);
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
            transactions: transactions.slice(0, 20),
          }
        : {
            period: 'текущий период',
            transactions: transactions.slice(0, 50),
          };

    // Используем fetch для streaming
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

    // Читаем текстовый stream от AI SDK
    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true });
      response.value += text;
    }

    loading.value = false;
    console.log('=== RESPONSE COMPLETE ===');
    console.log('Length:', response.value.length);
    console.log('========================');
  } catch (err: any) {
    console.error('Assistant error:', err);
    error.value = err.message || 'Произошла ошибка при обращении к ассистенту';
    loading.value = false;
  }
};
</script>

<style scoped>
.response-content {
  animation: fadeIn 0.3s ease-in-out;
  min-width: 0; /* Для правильного word-wrap */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Кастомный scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.slate.400') theme('colors.slate.100');
}

.dark .scrollbar-thin {
  scrollbar-color: theme('colors.slate.600') theme('colors.slate.800');
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: theme('colors.slate.100');
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-track {
  background: theme('colors.slate.800');
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: theme('colors.slate.400');
  border-radius: 3px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background: theme('colors.slate.600');
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: theme('colors.slate.500');
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: theme('colors.slate.500');
}
</style>
