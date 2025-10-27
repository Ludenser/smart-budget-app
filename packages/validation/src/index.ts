import { createError } from 'h3';

import type { ZodError, ZodIssue, ZodSchema } from 'zod';

const pathStr = (issue: ZodIssue) => (issue.path.length ? issue.path.join('.') : '(root)');

export const formatZodIssues = (e: ZodError) =>
  e.issues.map((i) => ({
    path: pathStr(i),
    message: i.message,
    expected: (i as any).expected,
    received: (i as any).received,
  }));

export const formatZodMessage = (e: ZodError) =>
  e.issues
    .map((i) => {
      const exp = (i as any).expected,
        rec = (i as any).received;
      const tail = exp || rec ? ` [expected: ${exp ?? '-'}, received: ${rec ?? '-'}]` : '';
      return `• ${pathStr(i)}: ${i.message}${tail}`;
    })
    .join('\n');

export function assertSchema<T extends ZodSchema>(schema: T, data: unknown): T['_output'] {
  const parsed = schema.safeParse(data);
  if (parsed.success) return parsed.data;
  const errors = formatZodIssues(parsed.error);
  throw createError({
    statusCode: 400,
    statusMessage: 'Validation error',
    data: { errors, pretty: formatZodMessage(parsed.error) },
  });
}
