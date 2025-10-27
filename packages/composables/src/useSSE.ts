import { onMounted, onScopeDispose, ref, unref } from 'vue';

import type { MaybeRef } from 'vue';

export interface UseSSEOptions {
  /** Callback при получении сообщения */
  onMessage: (chunk: string) => void;
  /** Callback при завершении стрима */
  onEnd?: () => void;
  /** Callback при ошибке */
  onError?: (error: Event) => void;
  /** Автоматически запускать при монтировании (по умолчанию true) */
  autoStart?: boolean;
}

/**
 * Композабл для работы с Server-Sent Events (SSE)
 * @param url - URL эндпоинта SSE (может быть реактивным)
 * @param options - опции для обработки событий
 * @returns объект с методами управления SSE соединением
 */
export const useSSE = (url: MaybeRef<string>, options: UseSSEOptions) => {
  const { onMessage, onEnd, onError, autoStart = true } = options;
  const source = ref<EventSource | null>(null);
  const isConnected = ref(false);

  const start = () => {
    if (typeof window === 'undefined') return;
    if (source.value) source.value.close();

    const resolvedUrl = typeof url === 'string' ? url : unref(url);
    const eventSource = new EventSource(resolvedUrl);

    eventSource.onopen = () => {
      isConnected.value = true;
    };

    eventSource.onmessage = (event) => {
      onMessage(event.data);
    };

    eventSource.addEventListener('end', () => {
      eventSource.close();
      isConnected.value = false;
      onEnd?.();
    });

    eventSource.onerror = (error) => {
      eventSource.close();
      isConnected.value = false;
      onError?.(error);
    };

    source.value = eventSource;
  };

  const close = () => {
    if (source.value) {
      source.value.close();
      source.value = null;
      isConnected.value = false;
    }
  };

  if (autoStart) {
    onMounted(start);
  }

  onScopeDispose(close);

  return {
    start,
    close,
    restart: start,
    isConnected,
  };
};
