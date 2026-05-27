import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#02274A',
          green: '#3AA83C',
          blue: '#1477D1',
          gold: '#FDB926',
          white: '#FBFCF9',
        },
      },
    },
  },
  plugins: [],
}

export default config
