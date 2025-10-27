import OpenAI from 'openai';

import type { GenerateParams, LLMClient, LLMResult } from '../index';
// ↓ возьмём корректные типы из ресурса
import type {
  ChatCompletionMessageParam,
  ChatCompletionChunk,
} from 'openai/resources/chat/completions';

interface OpenAIProviderOptions {
  apiKey?: string;
  model?: string;
}

export type MODEL =
  | 'text-davinci-002'
  | 'text-davinci-003'
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-0301'
  | 'gpt-3.5-turbo-1106'
  | 'gpt-5-nano'
  | 'gpt-4'
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-4-1106-preview'
  | 'gpt-4-0314'
  | 'gpt-4-0613'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'
  | 'gpt-4-32k-0613';

const defaultModel: MODEL = 'gpt-5-nano';

const buildMessages = (params: GenerateParams): ChatCompletionMessageParam[] => {
  const messages: ChatCompletionMessageParam[] = [];
  if (params.system) {
    messages.push({ role: 'system', content: params.system });
  }
  for (const m of params.messages) {
    // предполагаю, что у тебя role совместимы с Chat roles
    messages.push({ role: m.role as 'system' | 'user' | 'assistant', content: m.content });
  }
  return messages;
};

export class OpenAIClient implements LLMClient {
  private client: OpenAI;
  private options: OpenAIProviderOptions;

  constructor(options: OpenAIProviderOptions = {}) {
    const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required to use OpenAIClient');
    }
    this.options = { ...options, apiKey };
    this.client = new OpenAI({ apiKey });
  }

  async generate(params: GenerateParams): Promise<LLMResult> {
    const messages = buildMessages(params);
    const model = this.options.model ?? defaultModel;

    if (params.stream) {
      // вернём чистый AsyncIterable<string>
      console.log('model', model);
      const stream = await this.client.chat.completions.create({
        model,
        messages,
        stream: true,
      });

      async function* iterator(): AsyncIterable<string> {
        for await (const part of stream as AsyncIterable<ChatCompletionChunk>) {
          const delta = part.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length > 0) yield delta;
          // при желании: обработай finish_reason / role / tool_calls тут
        }
      }

      // предполагаю, что твой LLMResult допускает AsyncIterable<string>
      return iterator();
    }

    const completion = await this.client.chat.completions.create({
      model,
      messages,
    });

    const content = completion.choices?.[0]?.message?.content;
    console.log('content', content);
    return typeof content === 'string' ? content : '';
  }
}

export const createOpenAIClient = (options?: OpenAIProviderOptions): LLMClient => {
  return new OpenAIClient(options);
};
