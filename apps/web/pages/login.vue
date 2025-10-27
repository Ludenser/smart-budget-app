<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center">
    <BaseCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Войти в аккаунт</h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Введите email и пароль для входа (демо: demo@example.com / demo)
        </p>
      </template>

      <form class="mt-6 space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
            placeholder="demo@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Пароль</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
            placeholder="demo"
          />
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </BaseButton>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { BaseButton, BaseCard } from '@budget-habits/ui';

const { signIn } = useAuth();
const email = ref('demo@example.com');
const password = ref('demo');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const result = await signIn('credentials', {
      email: email.value,
      password: password.value,
      redirect: false,
    });

    if (result?.error) {
      error.value = 'Неверный email или пароль';
    } else {
      navigateTo('/app/dashboard');
    }
  } catch (e) {
    error.value = 'Ошибка входа';
  } finally {
    loading.value = false;
  }
};
</script>
