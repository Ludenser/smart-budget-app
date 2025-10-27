import { describe, it, expect } from 'vitest';

import { useSSE } from '@budget-habits/composables';

describe('useSSE', () => {
  it('возвращает restart и close', () => {
    const { restart, close } = useSSE('/sse', {
      onMessage: () => {},
      onEnd: () => {},
    });
    expect(restart).toBeTypeOf('function');
    expect(close).toBeTypeOf('function');
  });
});
