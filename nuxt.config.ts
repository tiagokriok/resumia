import en from './locales/en-US'
import es from './locales/es-ES'
import br from './locales/pt-BR'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  build: {
    transpile: ['trpc-nuxt', 'pinia-plugin-persistedstate'],
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    'nuxt-icon',
    '@nuxtjs/device',
    '@nuxtjs/color-mode',
    'vue-email/nuxt',
    '@nuxtjs/supabase',
  ],
  i18n: {
    vueI18n: './locales/i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  googleFonts: {
    families: {
      Lato: true,
    },
    display: 'swap',
    prefetch: false,
    preconnect: false,
    preload: true,
    download: false,
    base64: false,
  },
  colorMode: {
    preference: 'winter',
    dataValue: 'theme',
  },
  runtimeConfig: {
    jwtSecret: '',
    openaiApiKey: '',
    resendKey: '',
    fromEmail: '',
    applicationUrl: '',
  },
  routeRules: {
    '/app/**': {
      ssr: false,
    },
    '/': {
      redirect: '/app/login',
    },
  },
  vueEmail: {
    i18n: {
      defaultLocale: 'en-US',
      translations: {
        'en-US': en,
        'es-ES': es,
        'pt-BR': br,
      },
    },
  },
})
