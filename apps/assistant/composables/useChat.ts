import { readonly, ref } from 'vue';

import type { Message } from '@budget-habits/schemas';

export const useChat = () => {
  const messages = ref<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Привет! Я ваш AI-ассистент. Чем могу помочь?',
    },
  ]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const selectedModel = ref('gpt-4o-mini');

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading.value) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
    };

    messages.value.push(userMessage);
    isLoading.value = true;
    error.value = null;

    try {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: '...',
      };
      messages.value.push(assistantMessage);

      // Получаем индекс сообщения для обновления
      const messageIndex = messages.value.length - 1;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel.value,
          messages: messages.value.slice(0, -1).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // AI SDK возвращает простой текстовый поток (toTextStreamResponse)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      // Сбрасываем начальное значение "..."
      messages.value[messageIndex].content = '';

      let totalChunks = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        totalChunks++;
        messages.value[messageIndex].content += text;
      }

      console.log(
        `[useChat] Stream complete. Total chunks: ${totalChunks}, Final length: ${messages.value[messageIndex].content.length}`
      );
    } catch (err) {
      console.error('Chat error:', err);
      error.value = 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.';

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Извините, произошла ошибка. Попробуйте еще раз.',
      };

      messages.value.push(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  const clearMessages = () => {
    messages.value = [
      {
        id: '1',
        role: 'assistant',
        content: 'Привет! Я ваш AI-ассистент. Чем могу помочь?',
      },
    ];
    error.value = null;
  };

  return {
    messages: readonly(messages),
    isLoading: readonly(isLoading),
    error: readonly(error),
    selectedModel,
    sendMessage,
    clearMessages,
  };
};
