<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/40" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="translate-y-4 opacity-0"
            enter-to="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leave-from="translate-y-0 opacity-100"
            leave-to="translate-y-4 opacity-0"
          >
            <DialogPanel
              class="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900"
            >
              <DialogTitle class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ transaction ? 'Редактировать' : 'Новая транзакция' }}
              </DialogTitle>

              <Form
                class="mt-4 space-y-4"
                :validation-schema="validationSchema"
                :initial-values="
                  props.transaction
                    ? {
                        amount: props.transaction.amount,
                        currency: props.transaction.currency || 'RUB',
                        categoryId: props.transaction.categoryId || '',
                        description: props.transaction.description || '',
                        date: props.transaction.date
                          ? new Date(props.transaction.date).toISOString().split('T')[0]
                          : new Date().toISOString().split('T')[0],
                      }
                    : {
                        currency: 'RUB',
                        date: new Date().toISOString().split('T')[0],
                      }
                "
                @submit="submit"
              >
                <Field v-slot="{ field, errorMessage }" name="amount">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >Сумма</label
                  >
                  <input
                    v-bind="field"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                  />
                  <p v-if="errorMessage" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {{ errorMessage }}
                  </p>
                </Field>

                <div class="grid gap-4 md:grid-cols-2">
                  <Field v-slot="{ field, errorMessage }" name="currency">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >Валюта</label
                    >
                    <input
                      v-bind="field"
                      type="text"
                      required
                      placeholder="RUB"
                      class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                    />
                    <p v-if="errorMessage" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
                      {{ errorMessage }}
                    </p>
                  </Field>

                  <Field v-slot="{ field }" name="categoryId">
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >Категория</label
                    >
                    <select
                      v-bind="field"
                      class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400"
                    >
                      <option value="">Без категории</option>
                      <option
                        v-for="category in categoriesStore.items"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </Field>
                </div>

                <Field v-slot="{ field }" name="description">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >Описание</label
                  >
                  <textarea
                    v-bind="field"
                    rows="3"
                    placeholder="Описание транзакции..."
                    class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
                  />
                </Field>

                <Field v-slot="{ field, errorMessage }" name="date">
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300"
                    >Дата</label
                  >
                  <input
                    v-bind="field"
                    type="date"
                    required
                    class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  <p v-if="errorMessage" class="mt-1 text-xs text-rose-500 dark:text-rose-400">
                    {{ errorMessage }}
                  </p>
                </Field>

                <p v-if="error" class="text-sm text-rose-500 dark:text-rose-400">{{ error }}</p>

                <div class="flex justify-end gap-2">
                  <BaseButton
                    type="button"
                    variant="ghost"
                    :disabled="loading"
                    @click="emit('close')"
                  >
                    Отмена
                  </BaseButton>
                  <BaseButton type="submit" :disabled="loading">
                    {{ loading ? 'Сохранение...' : 'Сохранить' }}
                  </BaseButton>
                </div>
              </Form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { toTypedSchema } from '@vee-validate/zod';
import { Form, Field } from 'vee-validate';
import { z } from 'zod';

import { transactionSchema } from '@budget-habits/schemas';
import { BaseButton } from '@budget-habits/ui';

const props = defineProps<{ open: boolean; transaction: any | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const categoriesStore = useCategoriesStore();
const transactionsStore = useTransactionsStore();

const loading = ref(false);
const error = ref('');

// Сбрасываем состояние при открытии/закрытии
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loading.value = false;
      error.value = '';
    }
  }
);

const validationSchema = toTypedSchema(
  transactionSchema
    .pick({ amount: true, currency: true, categoryId: true, description: true, date: true })
    .extend({
      amount: z
        .number({ invalid_type_error: 'Введите сумму' })
        .min(0.01, 'Сумма должна быть положительной'),
      currency: z.string().min(3, 'Укажите валюту'),
      date: z.string({ required_error: 'Укажите дату' }),
    })
);

const submit = async (values: any) => {
  loading.value = true;
  error.value = '';

  try {
    const payload = transactionSchema.parse(values);

    if (props.transaction) {
      await $fetch(`/api/transactions/${props.transaction.id}`, { method: 'PATCH', body: payload });
    } else {
      await $fetch('/api/transactions', { method: 'POST', body: payload });
    }

    // Обновляем список транзакций
    await transactionsStore.fetch();

    // Закрываем модальное окно
    emit('close');
  } catch (err: any) {
    console.error('Failed to save transaction:', err);
    error.value = err.data?.message || err.message || 'Ошибка при сохранении';
  } finally {
    loading.value = false;
  }
};
</script>
