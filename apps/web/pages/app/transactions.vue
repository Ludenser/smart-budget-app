<template>
  <div class="space-y-6">
    <section
      class="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-700"
    >
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Импорт CSV</h2>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Загрузите файл CSV с транзакциями. Используйте шаблоны ниже для правильного формата.
      </p>
      <input
        type="file"
        accept=".csv"
        class="mt-4 block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-slate-400 dark:file:bg-indigo-900/20 dark:file:text-indigo-300 dark:hover:file:bg-indigo-900/30"
        @change="handleImport"
      />

      <div class="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <a
          href="/transactions-simple.csv"
          download
          class="rounded bg-emerald-100 px-2 py-1 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300"
          >🧪 Простой тест (3 транзакции)</a
        >
        <span class="text-slate-400">•</span>
        <a href="/transactions-template.csv" download class="text-indigo-600 hover:underline"
          >📥 Шаблон</a
        >
        <span class="text-slate-400">•</span>
        <a href="/transactions-example.csv" download class="text-indigo-600 hover:underline"
          >📥 Пример (9 транзакций)</a
        >
        <span class="text-slate-400">•</span>
        <a href="/transactions-realistic.csv" download class="text-indigo-600 hover:underline"
          >📥 Реалистичный (20 транзакций)</a
        >
      </div>

      <details class="mt-4 text-left text-xs text-slate-600 dark:text-slate-400">
        <summary class="cursor-pointer font-semibold">ℹ️ Формат CSV</summary>
        <div class="mt-2 space-y-2">
          <div>
            <p><strong>Обязательные поля:</strong></p>
            <ul class="ml-4 list-disc">
              <li><code>date</code> - дата в формате YYYY-MM-DD</li>
              <li><code>amount</code> - сумма (отрицательная для расходов)</li>
              <li><code>currency</code> - валюта (RUB, USD, EUR)</li>
            </ul>
          </div>
          <div>
            <p><strong>Опциональные поля:</strong></p>
            <ul class="ml-4 list-disc">
              <li><code>categoryId</code> - UUID категории (см. ниже)</li>
              <li><code>description</code> - описание транзакции</li>
              <li><code>source</code> - источник (manual, import)</li>
            </ul>
          </div>
          <div
            v-if="categoriesStore.items.length > 0"
            class="rounded border border-slate-300 bg-slate-50 p-2 dark:border-slate-600 dark:bg-slate-800"
          >
            <p class="mb-1 font-semibold">Доступные категории:</p>
            <ul class="ml-4 space-y-0.5 font-mono text-[10px]">
              <li
                v-for="cat in categoriesStore.items"
                :key="cat.id"
                class="flex items-center gap-2"
              >
                <span
                  class="inline-block h-2 w-2 rounded-full"
                  :style="{ backgroundColor: cat.color || '#666' }"
                ></span>
                <code class="text-indigo-600 dark:text-indigo-400">{{ cat.id }}</code> -
                {{ cat.name }}
              </li>
            </ul>
          </div>
        </div>
      </details>
    </section>

    <section
      class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Транзакции</h2>
          <p class="text-sm text-slate-600 dark:text-slate-300">
            Управляйте своими операциями, фильтруйте и отслеживайте в реальном времени.
          </p>
        </div>
        <BaseButton @click="openCreate">Добавить транзакцию</BaseButton>
      </header>

      <TransactionFilters class="mt-6" @filter="applyFilters" />

      <div class="mt-6 overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">
                Дата
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">
                Категория
              </th>
              <th class="px-4 py-2 text-left text-xs font-semibold uppercase text-slate-500">
                Описание
              </th>
              <th class="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-500">
                Сумма
              </th>
              <th class="px-4 py-2 text-right text-xs font-semibold uppercase text-slate-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr v-for="transaction in transactionsStore.items" :key="transaction.id">
              <td class="px-4 py-2">{{ formatDate(transaction.date) }}</td>
              <td class="px-4 py-2">{{ categoryName(transaction.categoryId) }}</td>
              <td class="px-4 py-2">{{ transaction.description }}</td>
              <td
                class="px-4 py-2 text-right"
                :class="transaction.amount >= 0 ? 'text-emerald-500' : 'text-rose-500'"
              >
                {{ formatCurrency(transaction.amount, transaction.currency) }}
              </td>
              <td class="px-4 py-2 text-right">
                <button
                  class="text-indigo-600 hover:underline"
                  @click="editTransaction(transaction)"
                >
                  Редактировать
                </button>
                <button
                  class="ml-3 text-rose-500 hover:underline"
                  @click="transaction.id && deleteTransaction(transaction.id)"
                >
                  Удалить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <TransactionModal
      :open="modalOpen"
      :transaction="currentTransaction"
      @close="modalOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { CategoryDto } from '@budget-habits/schemas';
import { BaseButton } from '@budget-habits/ui';

import TransactionFilters from '../../components/transactions/TransactionFilters.vue';
import TransactionModal from '../../components/transactions/TransactionModal.vue';
import { useCategoriesStore } from '../../stores/categories';
import { useTransactionsStore } from '../../stores/transactions';

const transactionsStore = useTransactionsStore();
const categoriesStore = useCategoriesStore();

onMounted(() => {
  transactionsStore.fetch();
  categoriesStore.fetch();
});

const modalOpen = ref(false);
const currentTransaction = ref(null);

const openCreate = () => {
  currentTransaction.value = null;
  modalOpen.value = true;
};

const editTransaction = (transaction: any) => {
  currentTransaction.value = transaction;
  modalOpen.value = true;
};

const deleteTransaction = async (id: string) => {
  await $fetch(`/api/transactions/${id}`, { method: 'DELETE' });
  transactionsStore.fetch();
};

const applyFilters = (filters: Record<string, string>) => {
  transactionsStore.filters = { ...transactionsStore.filters, ...filters };
  transactionsStore.fetch();
};

const handleImport = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (!files?.length) return;

  try {
    const formData = new FormData();
    formData.append('file', files[0]);
    const result = await $fetch('/api/transactions/import', { method: 'POST', body: formData });
    console.log('Import result:', result);

    // Обновляем список транзакций после импорта
    await transactionsStore.fetch();

    let message = `✅ Импортировано: ${result.imported.success} транзакций`;

    if (result.imported.failed > 0) {
      message += `\n❌ Ошибок: ${result.imported.failed}`;
      if (result.imported.errors.length > 0) {
        message += '\n\nПервые ошибки:';
        result.imported.errors.slice(0, 3).forEach((err: any) => {
          message += `\n- Строка ${err.row}: ${err.error}`;
        });
      }
    }

    alert(message);

    // Сбрасываем input, чтобы можно было загрузить тот же файл снова
    (event.target as HTMLInputElement).value = '';
  } catch (error: any) {
    console.error('Import error:', error);
    alert(`Ошибка импорта: ${error.data?.message || error.message}`);
  }
};

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('ru-RU', { style: 'currency', currency }).format(amount);
const formatDate = (date: string | Date) => new Intl.DateTimeFormat('ru-RU').format(new Date(date));

const categoryName = (categoryId: string | null | undefined) =>
  categoriesStore.items.find((cat: CategoryDto) => cat.id === categoryId)?.name ?? '—';
</script>
