import { describe, it, expect } from 'vitest';

import { redact } from '../src/redact';

describe('redact', () => {
  it('маскирует email и номера карт', () => {
    const text = 'contact me at john@example.com, card 4242 4242 4242 4242';
    const result = redact(text);
    expect(result).not.toContain('john@example.com');
    expect(result).not.toContain('4242');
  });
});
