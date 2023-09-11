import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: ['class', '[data-theme="night"]'],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        winter: {
          ...require('daisyui/src/theming/themes')['[data-theme=winter]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
      {
        night: {
          ...require('daisyui/src/theming/themes')['[data-theme=night]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
    ],
    darkTheme: 'dark',
  },
}
