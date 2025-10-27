<template>
  <div class="space-y-6">
    <div v-for="message in messages" :key="message.id" class="flex gap-4 chat-message">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div
          v-if="message.role === 'user'"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
        >
          <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600"
        >
          <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
      </div>

      <!-- Message Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-sm font-medium text-slate-300">
            {{ message.role === 'user' ? 'Вы' : 'AI Ассистент' }}
          </span>
          <span class="text-xs text-slate-500">
            {{ new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }}
          </span>
        </div>

        <div
          class="rounded-2xl px-4 py-3"
          :class="
            message.role === 'user'
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
              : 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
          "
        >
          <MarkdownViewer :content="message.content" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '@budget-habits/schemas';
import { MarkdownViewer } from '@budget-habits/ui';

defineProps<{ messages: Message[] }>();
</script>
