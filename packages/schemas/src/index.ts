import { z } from 'zod';

export const transactionSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  amount: z
    .string()
    .or(z.number())
    .transform((value) => Number(value)),
  currency: z.string().min(3),
  categoryId: z.string().uuid().optional().nullable(),
  description: z.string().max(500).optional().nullable(),
  date: z.coerce.date(),
  createdAt: z.coerce.date().optional(),
  source: z.enum(['manual', 'import']).optional(),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1).max(120),
  kind: z.enum(['INCOME', 'EXPENSE']),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional()
    .nullable(),
  createdAt: z.coerce.date().optional(),
});

export const habitSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  createdAt: z.coerce.date().optional(),
});

export const habitCheckSchema = z.object({
  id: z.string().uuid().optional(),
  habitId: z.string().uuid(),
  date: z.coerce.date(),
  value: z.boolean(),
});

export const ruleSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  pattern: z.string().min(1),
  categoryId: z.string().uuid(),
  enabled: z.boolean().default(true),
  createdAt: z.coerce.date().optional(),
});

export const reportShareSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  token: z.string().min(10),
  period: z.string().min(3),
  createdAt: z.coerce.date().optional(),
});

export const insightAuditSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  type: z.enum(['explain-trend', 'autotag', 'report']),
  payload: z.any(),
  tokensIn: z.number().int().nonnegative().optional(),
  tokensOut: z.number().int().nonnegative().optional(),
  createdAt: z.coerce.date().optional(),
});

export const insightAutotagRequestSchema = z.object({
  transactions: z
    .array(
      z.object({
        id: z.string(),
        description: z.string().max(500).optional().nullable(),
        amount: z.number(),
        currency: z.string().min(3),
      })
    )
    .min(1),
});

export const insightAutotagResponseSchema = z.array(
  z.object({
    id: z.string(),
    suggestedCategory: z.string().optional(),
    confidence: z.number().min(0).max(1),
    ruleDraft: z
      .object({
        pattern: z.string(),
        categoryId: z.string(),
      })
      .optional(),
  })
);

export const insightExplainTrendRequestSchema = z.object({
  period: z.string().min(3),
  categories: z.array(z.string()).optional(),
});

export const insightReportRequestSchema = z.object({
  period: z.string().min(3).optional().default('текущий период'),
  tone: z.enum(['formal', 'friendly']).optional().default('friendly'),
  locale: z.enum(['ru', 'en']).optional().default('ru'),
  transactions: z
    .array(
      z.object({
        amount: z.number(),
        currency: z.string().min(3),
        date: z.coerce.date(),
        category: z.string(),
      })
    )
    .min(1),
});

// Chat & Message Types
export const messageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  datetime_js: z.number().optional(),
});

export const chatSchema = z.object({
  id: z.string(),
  status: z.enum(['idle', 'thinking', 'streaming']),
  messages: z.array(messageSchema),
});

// Type exports
export type TransactionDto = z.infer<typeof transactionSchema>;
export type CategoryDto = z.infer<typeof categorySchema>;
export type HabitDto = z.infer<typeof habitSchema>;
export type HabitCheckDto = z.infer<typeof habitCheckSchema>;
export type RuleDto = z.infer<typeof ruleSchema>;
export type ReportShareDto = z.infer<typeof reportShareSchema>;
export type InsightAutotagRequest = z.infer<typeof insightAutotagRequestSchema>;
export type InsightAutotagResponse = z.infer<typeof insightAutotagResponseSchema>;
export type InsightExplainTrendRequest = z.infer<typeof insightExplainTrendRequestSchema>;
export type InsightReportRequest = z.infer<typeof insightReportRequestSchema>;
export type Message = z.infer<typeof messageSchema>;
export type Chat = z.infer<typeof chatSchema>;
