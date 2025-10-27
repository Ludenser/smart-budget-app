import { readFileSync } from 'fs';

import { PrismaClient } from '@prisma/client';
import formidable from 'formidable';

import { getServerSession } from '#auth';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const form = formidable({ multiples: false });
  const { files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(event.node.req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );

  // Ищем файл в любом поле
  const fileKeys = Object.keys(files);
  if (fileKeys.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'File is required' });
  }

  const fileEntry = files[fileKeys[0]];
  const file = Array.isArray(fileEntry) ? fileEntry[0] : fileEntry;

  if (!file || !file.filepath) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file' });
  }

  // Читаем CSV файл
  const content = readFileSync(file.filepath, 'utf-8');
  const lines = content.split('\n').filter((line) => line.trim());

  if (lines.length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'CSV file is empty' });
  }

  // Парсим заголовки
  const headers = lines[0].split(',').map((h) => h.trim());

  // Парсим первые 10 строк для предпросмотра
  const preview = lines.slice(1, 11).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    return row;
  });

  // Создаем маппинг колонок
  const mapping = headers.map((header) => ({
    csvColumn: header,
    dbField:
      header === 'date'
        ? 'date'
        : header === 'amount'
          ? 'amount'
          : header === 'currency'
            ? 'currency'
            : header === 'categoryId'
              ? 'categoryId'
              : header === 'description'
                ? 'description'
                : header === 'source'
                  ? 'source'
                  : null,
  }));

  // Импортируем все транзакции
  const results = {
    success: 0,
    failed: 0,
    errors: [] as any[],
  };

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const row: any = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    try {
      // Пропускаем пустые строки
      if (!row.date || !row.amount) continue;

      // Очищаем и валидируем данные
      const amount = parseFloat(row.amount);
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }

      // Валидируем categoryId - должен быть либо валидный UUID, либо null
      let categoryId: string | null = null;
      if (row.categoryId && row.categoryId.trim() !== '') {
        const trimmedId = row.categoryId.trim();
        // Простая проверка UUID формата (8-4-4-4-12)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedId)) {
          throw new Error(`Invalid UUID format for categoryId: ${trimmedId}`);
        }
        categoryId = trimmedId;
      }

      const description =
        row.description && row.description.trim() !== '' ? row.description.trim() : null;
      const source = row.source && row.source.trim() !== '' ? row.source.trim() : 'import';

      await prisma.transaction.create({
        data: {
          userId: userId,
          amount: amount,
          currency: row.currency || 'RUB',
          categoryId: categoryId,
          description: description,
          date: new Date(row.date),
          source: source,
        },
      });

      results.success++;
    } catch (error: any) {
      results.failed++;
      results.errors.push({
        row: i + 1, // Номер строки в файле (с учетом заголовка)
        data: row,
        error: error.message,
      });
    }
  }

  return {
    preview,
    mapping,
    totalRows: lines.length - 1,
    headers,
    imported: results,
  };
});
