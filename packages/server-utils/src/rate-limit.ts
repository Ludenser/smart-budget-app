import { createError } from 'h3';

interface RateLimitRecord {
  count: number;
  reset: number;
}

interface RateLimitOptions {
  /** Временное окно в миллисекундах (по умолчанию 1 час) */
  window?: number;
  /** Максимальное количество запросов в окне (по умолчанию 60) */
  max?: number;
}

/**
 * Простой in-memory rate limiter для API эндпоинтов
 * Для production рекомендуется использовать Redis
 */
export class RateLimiter {
  private limits = new Map<string, RateLimitRecord>();
  private window: number;
  private max: number;

  constructor(options: RateLimitOptions = {}) {
    this.window = options.window ?? 60 * 60 * 1000; // 1 час
    this.max = options.max ?? 60;
  }

  /**
   * Проверяет лимит для пользователя и выбрасывает ошибку 429 при превышении
   * @param userId - ID пользователя
   * @throws {H3Error} - 429 если лимит превышен
   */
  check(userId: string): void {
    const now = Date.now();
    const record = this.limits.get(userId) ?? { count: 0, reset: now + this.window };

    // Если окно истекло, сбрасываем счетчик
    if (record.reset < now) {
      this.limits.set(userId, { count: 1, reset: now + this.window });
      return;
    }

    // Проверяем превышение лимита
    if (record.count >= this.max) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Rate limit exceeded',
        data: {
          limit: this.max,
          window: this.window,
          resetAt: new Date(record.reset).toISOString(),
        },
      });
    }

    // Увеличиваем счетчик
    record.count += 1;
    this.limits.set(userId, record);
  }

  /**
   * Получает информацию о лимитах для пользователя
   * @param userId - ID пользователя
   * @returns информация о лимитах
   */
  getInfo(userId: string) {
    const record = this.limits.get(userId);
    if (!record) {
      return {
        remaining: this.max,
        limit: this.max,
        reset: null,
      };
    }

    return {
      remaining: Math.max(0, this.max - record.count),
      limit: this.max,
      reset: new Date(record.reset),
    };
  }

  /**
   * Сбрасывает лимит для пользователя
   * @param userId - ID пользователя
   */
  reset(userId: string): void {
    this.limits.delete(userId);
  }

  /**
   * Очищает все устаревшие записи
   */
  cleanup(): void {
    const now = Date.now();
    for (const [userId, record] of this.limits.entries()) {
      if (record.reset < now) {
        this.limits.delete(userId);
      }
    }
  }
}

// Экспортируем глобальный инстанс для insights API
export const insightRateLimiter = new RateLimiter({
  window: 60 * 60 * 1000, // 1 час
  max: 60,
});

/**
 * @deprecated Используйте insightRateLimiter.check() вместо этой функции
 */
export const assertRateLimit = (userId: string) => {
  insightRateLimiter.check(userId);
};
