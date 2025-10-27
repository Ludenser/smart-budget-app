import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createError, defineEventHandler, readBody } from 'h3';

import type { Message } from '@budget-habits/schemas';

export default defineEventHandler(async (event) => {
  try {
    // Проверяем наличие API ключа
    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OPENAI_API_KEY not configured',
      });
    }

    const body = await readBody(event);
    const payload = body as { model?: string; messages: Message[] };

    const modelName = payload.model || 'gpt-4o-mini';
    console.log(`[Chat API] Model: ${modelName}, Messages count: ${payload.messages.length}`);

    // O1 модели не поддерживают system промпты
    const isO1Model = modelName.startsWith('o1');

    // Для O1 моделей добавляем system промпт как первое сообщение от user
    const messages = payload.messages.map((message: { role: string; content: string }) => ({
      role: message.role as 'user' | 'assistant',
      content: message.content,
    }));

    if (isO1Model) {
      console.log('[Chat API] Using O1 model - will not use system prompt');
      // O1 модели не поддерживают system промпты, но они достаточно умные
      // чтобы понимать контекст без явных инструкций
    }

    const streamOptions: any = {
      model: openai(modelName),
      messages,
    };

    // Только для не-O1 моделей добавляем system промпт
    if (!isO1Model) {
      streamOptions.system = `Ты полезный AI-ассистент. Отвечай на русском языке, если пользователь пишет на русском, и на английском, если на английском. Будь дружелюбным и полезным.`;
    }

    console.log('[Chat API] Starting stream with options:', {
      model: modelName,
      hasSystem: !isO1Model,
      messagesCount: messages.length,
    });

    const result = streamText(streamOptions);

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('[Chat API] Error details:', {
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      cause: error?.cause,
    });

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Internal Server Error',
      data: {
        error: error?.message,
        type: error?.name,
      },
    });
  }
});
