const patterns: Array<{ regex: RegExp; replacement: string }> = [
  { regex: /[\w.+-]+@[\w-]+\.[\w.-]+/g, replacement: '[email]' },
  { regex: /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, replacement: '[card]' },
  { regex: /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/g, replacement: '[iban]' },
  { regex: /\b\d{2,3} [A-Za-zА-Яа-я0-9 .,-]+,? [A-Za-zА-Яа-я .-]+\b/g, replacement: '[address]' },
];

export const redact = (input: string | Record<string, unknown>): string => {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  return patterns.reduce((acc, { regex, replacement }) => acc.replace(regex, replacement), text);
};
