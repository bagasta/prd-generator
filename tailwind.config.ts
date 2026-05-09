import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        accent: '#00ff88',
        'accent-dim': '#00cc6a',
        surface: '#111111',
        border: '#222222',
        muted: '#444444',
        'muted-fg': '#888888',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      animation: {
        'pulse-cursor': 'pulse 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
