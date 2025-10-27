<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <header
      class="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          {{ t('common.title') }}
        </NuxtLink>
        <nav class="flex items-center gap-4 text-sm">
          <NuxtLink class="hover:text-indigo-600" to="/app/dashboard">
            {{ t('common.dashboard') }}
          </NuxtLink>
          <NuxtLink class="hover:text-indigo-600" to="/app/transactions">
            {{ t('common.transactions') }}
          </NuxtLink>
          <NuxtLink class="hover:text-indigo-600" to="/app/habits">
            {{ t('common.habits') }}
          </NuxtLink>
          <NuxtLink class="hover:text-indigo-600" to="/app/profile">
            {{ t('common.profile') }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <AuthToggle />
        </div>
      </div>
    </header>
    <main class="mx-auto max-w-6xl px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import AuthToggle from '~/components/AuthToggle.vue';
import LocaleSwitcher from '~/components/LocaleSwitcher.vue';
import ThemeToggle from '~/components/ThemeToggle.vue';

const { t } = useI18n();
</script>
