import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ToolDefinition {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface GenerateParams {
  system?: string;
  messages: LLMMessage[];
  tools?: ToolDefinition[];
  stream?: boolean;
}

export type LLMResult = string | AsyncIterable<string>;

export interface LLMClient {
  generate(params: GenerateParams): LLMResult | Promise<LLMResult>;
}

export const toOpenAIMessage = (message: LLMMessage): ChatCompletionMessageParam => ({
  role: message.role,
  content: message.content,
});

export * from './providers/openai';
export * from './providers/mock';
export * from './redact';
