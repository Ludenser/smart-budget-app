# @budget-habits/composables

Общие Vue композаблы для использования в приложениях.

## Установка

```bash
pnpm add @budget-habits/composables
```

## Композаблы

### useDebounce

Дебаунсит реактивные значения с настраиваемой задержкой.

```typescript
import { useDebounce } from '@budget-habits/composables';
import { ref } from 'vue';

const searchQuery = ref('');
const debouncedQuery = useDebounce(searchQuery, 500);

// debouncedQuery обновится через 500ms после последнего изменения searchQuery
```

### useSSE

Композабл для работы с Server-Sent Events (SSE).

```typescript
import { useSSE } from '@budget-habits/composables';

const { start, close, isConnected } = useSSE('/api/stream', {
  onMessage: (data) => {
    console.log('Получено:', data);
  },
  onEnd: () => {
    console.log('Стрим завершен');
  },
  onError: (error) => {
    console.error('Ошибка:', error);
  },
  autoStart: true, // запускать автоматически при монтировании
});
```

## Сборка

```bash
pnpm build
```

## Разработка

```bash
pnpm dev
```
