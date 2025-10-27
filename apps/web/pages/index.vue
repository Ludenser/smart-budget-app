<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <h1 class="text-4xl font-bold text-slate-900 dark:text-white">Добро пожаловать</h1>
    <p class="mt-4 max-w-xl text-slate-600 dark:text-slate-300">
      Budget & Habits Dashboard помогает контролировать финансы и развивать здоровые привычки.
    </p>
    <BaseButton class="mt-8" @click="goToDashboard"> Перейти в приложение </BaseButton>
    <BaseButton class="mt-8" @click="goToAssistant"> Перейти в ассистент AI </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { BaseButton } from '@budget-habits/ui';

const goToDashboard = () => navigateTo('/app/dashboard');
const goToAssistant = () => navigateTo('http://localhost:3001');
</script>
