import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
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
        lofi: {
          ...require('daisyui/src/theming/themes')['[data-theme=lofi]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
      {
        black: {
          ...require('daisyui/src/theming/themes')['[data-theme=black]'],
          '--btn-text-case': 'uppercase',
          '--rounded-btn': '0.75rem',
        },
      },
    ],
    darkTheme: 'black',
  },
}
