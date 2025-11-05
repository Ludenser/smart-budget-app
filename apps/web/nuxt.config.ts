import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  srcDir: '.',
  typescript: {
    strict: true,
  },
  modules: [
    '@pinia/nuxt',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'no_prefix',
        locales: [
          { code: 'ru', language: 'ru', name: 'Русский', file: 'ru.json' },
          { code: 'en', language: 'en', name: 'English', file: 'en.json' },
        ],
        defaultLocale: 'ru',
        lazy: true,
        langDir: 'locales',
        detectBrowserLanguage: {
          useCookie: true,
          cookieKey: 'i18n_redirected',
          redirectOn: 'root',
        },
        bundle: {
          optimizeTranslationDirective: false,
        },
      },
    ],
    '@vite-pwa/nuxt',
    '@nuxt/image',
    '@sidebase/nuxt-auth',
  ],
  auth: {
    baseURL:
      process.env.AUTH_ORIGIN ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
      'http://localhost:3000',
    provider: {
      type: 'authjs',
    },
  },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  imports: {
    dirs: ['stores', 'composables'],
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET || 'dev-secret-key-change-in-production',
    openAI: {
      apiKey: process.env.OPENAI_API_KEY,
    },
    public: {
      defaultLocale: process.env.NUXT_I18N_DEFAULT_LOCALE || 'ru',
    },
  },
  nitro: {
    experimental: {
      websocket: true,
    },
    rollupConfig: {
      external: ['@prisma/client', '.prisma'],
    },
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Budget & Habits Dashboard',
      short_name: 'BudgetHabits',
      theme_color: '#4f46e5',
      background_color: '#1f2937',
      display: 'standalone',
      lang: 'ru',
      start_url: '/',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },
  experimental: {
    payloadExtraction: true,
  },
  routeRules: {
    '/report/**': { swr: 60 },
  },
  build: {
    transpile: [
      '@budget-habits/ui',
      '@budget-habits/llm',
      '@prisma/client',
      '@budget-habits/sse',
      '@budget-habits/validation',
    ],
  },
});
