<template>
  <form class="flex items-end gap-4" @submit.prevent="submit">
    <div class="flex-1">
      <textarea
        ref="textareaRef"
        v-model="message"
        :disabled="isLoading"
        rows="1"
        placeholder="Напишите сообщение..."
        class="w-full resize-none rounded-2xl border border-slate-600/50 bg-slate-800/50 px-4 py-3 text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed chat-input"
        @input="autoResize"
        @keydown.enter.prevent="handleEnter"
      />
    </div>
    <button
      type="submit"
      :disabled="!message.trim() || isLoading"
      class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all duration-200 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
    >
      <svg v-if="!isLoading" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
      <svg v-else class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const emit = defineEmits<{ (e: 'submit', value: string): void }>();
const message = ref('');
const textareaRef = ref<HTMLTextAreaElement>();

const props = defineProps<{
  isLoading?: boolean;
}>();

const autoResize = async () => {
  await nextTick();
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`;
  }
};

const handleEnter = (event: KeyboardEvent) => {
  if (event.shiftKey) {
    // Shift + Enter = новая строка
    return;
  }
  // Enter = отправить
  event.preventDefault();
  submit();
};

const submit = () => {
  if (!message.value.trim() || props.isLoading) return;
  emit('submit', message.value);
  message.value = '';
  // Сброс высоты textarea
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
};
</script>
