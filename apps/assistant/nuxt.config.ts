import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  typescript: {
    strict: true,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/i18n',
      {
        strategy: 'prefix_except_default',
        locales: [
          { code: 'ru', language: 'ru', name: 'Русский' },
          { code: 'en', language: 'en', name: 'English' },
        ],
        defaultLocale: 'ru',
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
  ],
  css: ['~/assets/css/main.scss'],
  build: {
    transpile: ['@budget-habits/llm', '@budget-habits/sse', '@budget-habits/validation'],
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    openAI: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
});
