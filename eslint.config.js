import js from '@eslint/js';
import vueTsEslintConfig from '@vue/eslint-config-typescript';
import prettier from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

export default [
  // Игнорируемые файлы
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/*.d.ts',
      '**/pnpm-lock.yaml',
    ],
  },

  // Базовая конфигурация для всех JS/TS файлов
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // Рекомендуемые правила ESLint
  js.configs.recommended,

  // Vue 3 конфигурация
  ...pluginVue.configs['flat/recommended'],

  // TypeScript конфигурация для Vue
  ...vueTsEslintConfig(),

  // Import plugin
  {
    plugins: {
      import: pluginImport,
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@budget-habits/**',
              group: 'internal',
            },
            {
              pattern: '~/**',
              group: 'internal',
            },
            {
              pattern: '#**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'warn',
    },
  },

  // Кастомные правила
  {
    rules: {
      // Vue правила
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'warn',
      'vue/html-self-closing': [
        'warn',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],

      // TypeScript правила
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Общие правила
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // Особые правила для конфигурационных файлов
  {
    files: ['**/*.config.{js,ts,cjs,mjs}', '**/tailwind.config.{js,ts}', '**/vite.config.{js,ts}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Prettier должен быть последним
  prettier,
];
