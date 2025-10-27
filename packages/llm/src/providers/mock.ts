import type { GenerateParams, LLMClient, LLMResult } from '../index';

export class MockLLMClient implements LLMClient {
  async generate(params: GenerateParams): Promise<LLMResult> {
    const content =
      params.messages
        .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
        .join('\n') || 'No messages provided.';

    if (params.stream) {
      async function* iterator() {
        const chunks = content.match(/.{1,40}/g) ?? [content];
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          yield chunk;
        }
      }

      return iterator();
    }

    return `Mock response:\n${content}`;
  }
}

export const createMockClient = (): LLMClient => new MockLLMClient();
