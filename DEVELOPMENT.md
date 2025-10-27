# 🛠️ Development Guide

## Настройка IDE

### VS Code / Cursor

Проект настроен для автоматического форматирования при сохранении.

#### Необходимые расширения:

- **ESLint** (`dbaeumer.vscode-eslint`) - для линтинга
- **Prettier** (`esbenp.prettier-vscode`) - для форматирования
- **Volar** (`vue.volar`) - для Vue.js
- **Tailwind CSS IntelliSense** - для Tailwind классов
- **Prisma** - для работы с Prisma схемами

После открытия проекта VS Code/Cursor предложит установить рекомендуемые расширения.

#### Автоматическая настройка:

Все настройки уже в `.vscode/settings.json`:

- ✅ Форматирование при сохранении
- ✅ ESLint автофикс при сохранении
- ✅ Правильные настройки для Vue, TS, JS

### WebStorm / IntelliJ IDEA

1. **Settings → Languages & Frameworks → JavaScript → Prettier**
   - Включите "On save"
   - Укажите путь к Prettier: `node_modules/prettier`

2. **Settings → Languages & Frameworks → JavaScript → Code Quality Tools → ESLint**
   - Включите "Automatic ESLint configuration"
   - Включите "Run eslint --fix on save"

## Команды для форматирования

### Проверка форматирования

```bash
# Проверить все файлы на соответствие Prettier
pnpm format

# Проверить ESLint ошибки
pnpm lint
```

### Автоматическое исправление

```bash
# Исправить форматирование всех файлов
pnpm format:write

# Исправить ESLint ошибки
pnpm lint:fix

# Исправить всё (Prettier + ESLint)
pnpm format:all
```

## Правила форматирования

### Prettier

- Single quotes (`'`)
- Semicolons (`;`)
- Trailing commas в ES5 стиле
- Print width: 100 символов
- Tab width: 2 пробела
- Line endings: LF (`\n`)

### ESLint

- Vue 3 recommended rules
- TypeScript recommended rules
- Import organization с группировкой
- No unused variables (с префиксом `_` для игнорирования)
- No explicit `any` (только warnings)

## Pre-commit hooks

Настроены автоматические проверки перед коммитом:

### Husky + lint-staged

При каждом коммите автоматически:

1. ✅ Запускается Prettier на измененные файлы
2. ✅ Запускается ESLint с автофиксом
3. ✅ Проверяется формат commit message (Conventional Commits)

### Формат commit message

```bash
# Правильно
feat: add new feature
fix: resolve bug
docs: update readme
refactor: improve code structure

# Неправильно
Added new feature
bug fix
Update
```

## Структура проекта

```
.
├── .vscode/              # Настройки VS Code
│   ├── settings.json     # Автоформатирование
│   └── extensions.json   # Рекомендуемые расширения
├── eslint.config.js      # Конфигурация ESLint (Flat Config)
├── .prettierrc           # Конфигурация Prettier
├── .prettierignore       # Исключения для Prettier
├── .editorconfig         # Единообразие кода в разных IDE
└── .husky/               # Git hooks
```

## ESLint Flat Config

Проект использует новый **Flat Config** формат ESLint 9+:

- ✅ Современный формат конфигурации (массив объектов)
- ✅ Лучшая производительность
- ✅ Более гибкая настройка правил для разных файлов
- ✅ TypeScript + Vue 3 поддержка из коробки

## Troubleshooting

### Форматирование не работает при сохранении

1. Убедитесь что установлены расширения ESLint и Prettier
2. Перезагрузите VS Code/Cursor
3. Проверьте что файл `.vscode/settings.json` существует
4. Откройте Command Palette (Ctrl+Shift+P) и выполните:
   - "ESLint: Restart ESLint Server"
   - "Developer: Reload Window"

### ESLint ошибки после установки

```bash
# Переустановите зависимости
pnpm install

# Пересоберите пакеты
pnpm build
```

### Prettier конфликтует с ESLint

Проект использует `eslint-config-prettier` который отключает конфликтующие правила ESLint.
Если видите конфликты:

```bash
# Убедитесь что Prettier идёт последним в extends
# Это уже настроено в .eslintrc.cjs
```

## Рекомендации

### Import Order

Импорты автоматически сортируются в группы:

1. Node.js встроенные модули (`fs`, `path`)
2. Внешние пакеты (`vue`, `zod`)
3. Внутренние модули workspace (`@budget-habits/*`)
4. Nuxt автоимпорты (`#imports`, `~/*`)
5. Относительные импорты (`./`, `../`)
6. Type imports (в конце)

### TypeScript

- Используйте `interface` вместо `type` где возможно
- Избегайте `any`, используйте `unknown` если тип неизвестен
- Префиксуйте неиспользуемые переменные с `_` (например: `_unused`)

### Vue

- Используйте Composition API (`<script setup>`)
- Явно определяйте emits (`defineEmits<...>()`)
- Используйте самозакрывающиеся теги где возможно

## CI/CD

При push в репозиторий запускаются:

- ✅ ESLint проверка
- ✅ TypeScript проверка
- ✅ Prettier проверка
- ✅ Unit тесты
- ✅ E2E тесты
- ✅ Build

Все эти проверки должны пройти перед merge в main.
