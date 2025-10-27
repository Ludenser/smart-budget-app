import { describe, it, expect } from 'vitest';

import { useRealtime } from '~/composables/useRealtime';

describe('useRealtime', () => {
  it('возвращает subscribe/unsubscribe', () => {
    const realtime = useRealtime();
    expect(realtime.subscribe).toBeTypeOf('function');
    expect(realtime.unsubscribe).toBeTypeOf('function');
  });
});
