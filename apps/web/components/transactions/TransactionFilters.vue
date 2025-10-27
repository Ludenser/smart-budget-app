<template>
  <div class="grid gap-4 md:grid-cols-5">
    <div class="md:col-span-2">
      <label class="block text-xs font-medium uppercase text-slate-500 dark:text-slate-400"
        >Период</label
      >
      <div class="mt-1 flex gap-2">
        <input
          v-model="filters.from"
          type="date"
          class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 [color-scheme:light] dark:[color-scheme:dark]"
        />
        <input
          v-model="filters.to"
          type="date"
          class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>
    </div>
    <div>
      <label class="block text-xs font-medium uppercase text-slate-500 dark:text-slate-400"
        >Категория</label
      >
      <select
        v-model="filters.categoryId"
        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
      >
        <option value="">Все</option>
        <option v-for="category in categoriesStore.items" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div>
      <label class="block text-xs font-medium uppercase text-slate-500 dark:text-slate-400"
        >Поиск</label
      >
      <input
        v-model="filters.q"
        type="text"
        placeholder="Описание..."
        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
      />
    </div>
    <div class="flex items-end gap-2">
      <BaseButton type="button" variant="ghost" @click="reset">Сбросить</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounce } from '@budget-habits/composables';
import { BaseButton } from '@budget-habits/ui';

const emit = defineEmits<{ (e: 'filter', payload: Record<string, string>): void }>();
const categoriesStore = useCategoriesStore();

const filters = reactive({ from: '', to: '', categoryId: '', q: '' });

// Создаем дебаунсированные версии каждого поля
const debouncedFilters = reactive({
  from: useDebounce(toRef(filters, 'from'), 300),
  to: useDebounce(toRef(filters, 'to'), 300),
  categoryId: useDebounce(toRef(filters, 'categoryId'), 300),
  q: useDebounce(toRef(filters, 'q'), 500), // Больше задержка для текстового поиска
});

// Автоматически эмитим изменения при изменении дебаунсированных значений
watch(
  debouncedFilters,
  (newFilters) => {
    emit('filter', {
      from: newFilters.from,
      to: newFilters.to,
      categoryId: newFilters.categoryId,
      q: newFilters.q,
    });
  },
  { deep: true }
);

const reset = () => {
  filters.from = '';
  filters.to = '';
  filters.categoryId = '';
  filters.q = '';
};
</script>
