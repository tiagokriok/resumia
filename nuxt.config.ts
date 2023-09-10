// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  build: {
    transpile: ['trpc-nuxt'],
  },
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    'nuxt-headlessui',
    'nuxt-icon',
    '@nuxtjs/device',
    '@nuxtjs/color-mode',
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
    preference: 'lofi',
    dataValue: 'theme',
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    mongoURI: process.env.MONGODB_URI,
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKET,
  },
  nitro: {
    plugins: ['~/server/plugins/database.ts'],
  },
  routeRules: {
    '/app/**': {
      ssr: false,
    },
    '/': {
      redirect: '/app/login',
    },
  },
})
