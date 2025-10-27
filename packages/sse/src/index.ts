// server/utils/sse.ts
import { Readable } from 'node:stream';

import { setHeader } from 'h3';

import type { H3Event } from 'h3';

export type SSEChunk = string | Uint8Array;
export interface SSEOptions<T = SSEChunk> {
  /** Название события по умолчанию (EventSource onmessage) */
  eventName?: string; // 'message' | 'token' | ...
  /** Преобразователь чанка в строку; по умолчанию String() */
  mapChunk?: (chunk: T) => string;
  /** Heartbeat для прокси (мс); 0 — отключить */
  heartbeatMs?: number; // напр. 15000
  /** Вызывается один раз при открытии */
  onOpen?: () => void | Promise<void>;
  /** Вызывается при успешном завершении */
  onEnd?: () => void | Promise<void>;
  /** Вызывается при ошибке */
  onError?: (err: any) => void | Promise<void>;
  /** Доп. заголовки */
  headers?: Record<string, string>;
}

/**
 * Оборачивает AsyncIterable в корректный SSE-ответ h3 (Nitro).
 * Возвращайте результат этой функции из defineEventHandler.
 */
export function sse<T = SSEChunk>(
  event: H3Event,
  source: AsyncIterable<T> | Iterable<T>,
  opts: SSEOptions<T> = {}
) {
  const {
    eventName,
    mapChunk = (c) => String(c),
    heartbeatMs = 15000,
    onOpen,
    onEnd,
    onError,
    headers = {},
  } = opts;

  // Базовые SSE-заголовки + антибуферизация
  setHeader(event, 'Content-Type', 'text/event-stream; charset=utf-8');
  setHeader(event, 'Cache-Control', 'no-cache, no-transform');
  setHeader(event, 'Connection', 'keep-alive');
  setHeader(event, 'X-Accel-Buffering', 'no');
  for (const [k, v] of Object.entries(headers)) setHeader(event, k, v);

  const readable = Readable.from(
    (async function* () {
      // Сигнал "открыто"
      yield 'event: open\n\n';
      if (onOpen) await onOpen();

      // Heartbeat (поддерживает соединение за Nginx/CF)
      let hbTimer: NodeJS.Timeout | null = null;
      const heartbeat = async function* () {
        while (true) {
          await new Promise((r) => (hbTimer = setTimeout(r, heartbeatMs)));
          yield ': heartbeat\n\n'; // комментарий — валидный SSE ping
        }
      };

      const hbIter = heartbeatMs > 0 ? heartbeat() : null;

      try {
        // Параллельно «тикать» heartbeat
        const src = source as AsyncIterable<T>;
        const srcIter = src[Symbol.asyncIterator]();

        // Простой мультиплекс: читаем либо из src, либо heartbeat
        while (true) {
          const race = (await Promise.race([
            srcIter.next(),
            hbIter?.next() ?? new Promise<never>(() => {}), // если hb выкл
          ])) as IteratorResult<any>;

          // Пришёл heartbeat
          if (race?.value === ': heartbeat\n\n') {
            yield race.value;
            continue;
          }

          // Источник закончился
          if (race?.done) break;

          const text = mapChunk(race.value);
          // SSE: префиксуем каждую строку data:, затем пустая строка
          const lines = text.split('\n');
          if (eventName) yield `event: ${eventName}\n`;
          for (const line of lines) yield `data: ${line}\n`;
          yield '\n';
        }

        yield 'event: end\n\n';
        if (onEnd) await onEnd();
      } catch (err) {
        yield `event: error\ndata: ${String((err as any)?.message ?? err)}\n\n`;
        if (onError) await onError(err);
      } finally {
        if (hbTimer) clearTimeout(hbTimer);
      }
    })()
  );

  return readable;
}

/** HOF: принимает фабрику AsyncIterable и возвращает h3-хендлер с SSE */
export function withSSE<T = SSEChunk>(
  factory: (event: H3Event) => Promise<AsyncIterable<T>> | AsyncIterable<T>,
  opts?: SSEOptions<T>
) {
  return async (event: H3Event) => {
    const src = await factory(event);
    return sse(event, src, opts);
  };
}
