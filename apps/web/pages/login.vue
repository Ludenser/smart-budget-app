<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center py-8">
    <BaseCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">
          {{ isRegister ? 'Регистрация' : 'Войти в аккаунт' }}
        </h1>
        <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
          {{ isRegister ? 'Создайте новый аккаунт' : 'Введите email и пароль для входа' }}
        </p>
      </template>

      <form class="mt-6 space-y-4" @submit.prevent="isRegister ? handleRegister() : handleLogin()">
        <div v-if="isRegister">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Имя</label>
          <input
            v-model="name"
            type="text"
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
            placeholder="Ваше имя"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Пароль</label>
          <input
            v-model="password"
            type="password"
            required
            class="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-400"
            :placeholder="isRegister ? 'Минимум 6 символов' : 'Ваш пароль'"
          />
        </div>

        <BaseButton type="submit" class="w-full" :disabled="loading">
          {{ loading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти' }}
        </BaseButton>

        <p v-if="error" class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <p v-if="success" class="text-sm text-green-600 dark:text-green-400">{{ success }}</p>
      </form>

      <!-- Разделитель -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-slate-300 dark:border-slate-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            или
          </span>
        </div>
      </div>

      <!-- Кнопка GitHub -->
      <BaseButton
        type="button"
        class="w-full flex items-center justify-center gap-2 !bg-slate-900 hover:!bg-slate-800 dark:!bg-slate-700 dark:hover:!bg-slate-600"
        @click="handleGithubLogin"
      >
        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
          />
        </svg>
        Войти через GitHub
      </BaseButton>

      <!-- Переключатель между входом и регистрацией -->
      <div class="mt-6 text-center text-sm">
        <button
          type="button"
          class="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          @click="toggleMode"
        >
          {{ isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться' }}
        </button>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { BaseButton, BaseCard } from '@budget-habits/ui';

const { signIn } = useAuth();
const isRegister = ref(false);
const email = ref('');
const password = ref('');
const name = ref('');
const loading = ref(false);
const error = ref('');
const success = ref('');

const toggleMode = () => {
  isRegister.value = !isRegister.value;
  error.value = '';
  success.value = '';
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

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

const handleRegister = async () => {
  loading.value = true;
  error.value = '';
  success.value = '';

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
        name: name.value || undefined,
      },
    });

    if (response.success) {
      success.value = 'Регистрация успешна! Выполняется вход...';

      // Автоматический вход после регистрации
      setTimeout(async () => {
        await handleLogin();
      }, 1000);
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
};

const handleGithubLogin = async () => {
  try {
    await signIn('github', {
      callbackUrl: '/app/dashboard',
    });
  } catch (e) {
    error.value = 'Ошибка входа через GitHub';
  }
};
</script>
