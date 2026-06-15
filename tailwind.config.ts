import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f6f7f5',          // page background — crisp near-white
        surface: '#ffffff',      // cards / raised surfaces
        'surface-2': '#eef0ee',  // secondary surface
        ink: '#14201a',          // primary text
        'ink-muted': '#5a635d',  // muted / body text
        accent: '#0f9d6b',       // emerald
        'accent-dark': '#0b7a52',// emerald strong / hover
        muted: '#5a635d',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
