import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: ['class', '[data-theme="dark"]'],
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
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
      {
        dark: {
          ...require('daisyui/src/theming/themes')['[data-theme=dark]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
    ],
    darkTheme: 'dark',
  },
}
