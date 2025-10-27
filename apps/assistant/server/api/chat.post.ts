import { defineEventHandler, readBody } from 'h3';

import { createOpenAIClient } from '@budget-habits/llm';
import type { Message } from '@budget-habits/schemas';
import { withSSE } from '@budget-habits/sse';

const client = createOpenAIClient({ model: 'gpt-5-nano' });

export default defineEventHandler(
  withSSE(
    async (event) => {
      const body = await readBody(event);
      const payload = body as { messages: Message[] };

      const stream = await client.generate({
        system: `Ты полезный AI-ассистент. Отвечай на русском языке, если пользователь пишет на русском, и на английском, если на английском. Будь дружелюбным и полезным.`,
        messages: [
          {
            role: 'user',
            content: payload.messages
              .map(
                (message: { role: string; content: string }) =>
                  `${message.role}: ${message.content}`
              )
              .join('\n'),
          },
        ],
        stream: true,
      });

      return stream as AsyncIterable<string>;
    },
    {
      eventName: 'token',
      heartbeatMs: 15000,
      onEnd: async () => {
        // ⚠ сюда не протащили payload/userId; если нужно — замкни их во внешнем scope
        // пример: перенеси withSSE внутрь defineEventHandler, чтобы иметь доступ
      },
    }
  )
);
