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
            <p class="text-sm text-slate-400">Ваш персональный помощник</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
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
import { ref } from 'vue';

import type { Message } from '@budget-habits/schemas';

import ChatInput from '../components/Chat/ChatInput.vue';
import MessageList from '../components/Chat/MessageList.vue';
import { useChat } from '../composables/useChat';

const { messages, isLoading, error, sendMessage } = useChat();
const locale = ref('ru');
</script>
