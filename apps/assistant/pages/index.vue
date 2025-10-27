<template>
  <div
    class="flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
  >
    <!-- Header -->
    <header
      class="sticky top-0 z-10 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl px-6 py-4"
    >
      <a
        href="http://localhost:3000"
        class="absolute top-50 left-5 rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
      >
        ← Вернуться в приложение <span class="text-sm text-slate-400">🔗</span>
      </a>
      <div class="mx-auto flex max-w-4xl items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-slate-100">AI Ассистент</h1>
            <p class="text-sm text-slate-400">
              <span class="inline-flex items-center gap-1">
                <span>Модель:</span>
                <span class="font-medium text-indigo-400">{{ selectedModel }}</span>
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <select
            v-model="selectedModel"
            class="rounded-lg bg-slate-800/50 px-3 py-2 text-sm text-slate-200 border border-slate-700/50 focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="gpt-4o">🚀 GPT-4o (Самая мощная)</option>
            <option value="gpt-4o-mini">⚡ GPT-4o Mini (Быстрая)</option>
            <option value="gpt-4-turbo">🔥 GPT-4 Turbo</option>
            <option value="gpt-3.5-turbo">💨 GPT-3.5 Turbo (Экономная)</option>
            <option value="o1">🧠 O1 (Reasoning - медленная)</option>
            <option value="o1-mini">🤔 O1-Mini (Reasoning - медленная)</option>
          </select>
          <select
            v-model="locale"
            class="rounded-lg bg-slate-800/50 px-3 py-2 text-sm text-slate-200 border border-slate-700/50 focus:border-indigo-500 focus:outline-none transition-colors"
          >
            <option value="ru">🇷🇺 RU</option>
            <option value="en">🇺🇸 EN</option>
          </select>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-8">
      <!-- Messages Container -->
      <section
        class="flex-1 rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-6 shadow-2xl"
      >
        <MessageList :messages="messages as Message[]" />
      </section>

      <!-- O1 Thinking Indicator -->
      <div
        v-if="isLoading && isO1Model"
        class="rounded-2xl border border-purple-500/30 bg-purple-900/20 p-4 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 text-purple-400">
          <svg
            class="h-5 w-5 flex-shrink-0 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <span class="text-sm font-medium">O1 модель размышляет... (может занять до 30 сек)</span>
        </div>
      </div>

      <!-- Model Changed Notification -->
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 transform translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform translate-y-2"
      >
        <div
          v-if="modelChanged"
          class="rounded-2xl border border-indigo-500/30 bg-indigo-900/20 p-4 backdrop-blur-sm"
        >
          <div class="flex items-center gap-3 text-indigo-400">
            <svg
              class="h-5 w-5 flex-shrink-0"
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
            <span class="text-sm font-medium">Модель изменена на {{ selectedModel }}</span>
          </div>
        </div>
      </Transition>

      <!-- Error Message -->
      <div
        v-if="error"
        class="rounded-2xl border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm"
      >
        <div class="flex items-center gap-3 text-red-400">
          <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm font-medium">{{ error }}</span>
        </div>
      </div>

      <!-- Input Container -->
      <section
        class="rounded-2xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm p-4 shadow-2xl"
      >
        <ChatInput :is-loading="isLoading" @submit="sendMessage" />
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import type { Message } from '@budget-habits/schemas';

import ChatInput from '../components/Chat/ChatInput.vue';
import MessageList from '../components/Chat/MessageList.vue';
import { useChat } from '../composables/useChat';

const { messages, isLoading, error, selectedModel, sendMessage } = useChat();
const locale = ref('ru');
const modelChanged = ref(false);

// Проверяем является ли модель O1
const isO1Model = computed(() => selectedModel.value.startsWith('o1'));

// Показываем уведомление при смене модели
watch(selectedModel, (newModel, oldModel) => {
  if (oldModel && newModel !== oldModel) {
    modelChanged.value = true;
    setTimeout(() => {
      modelChanged.value = false;
    }, 2000);
  }
});
</script>
