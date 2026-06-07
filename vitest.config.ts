import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/__tests__/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['contexts/**', 'lib/**', 'components/**', 'app/**'],
      exclude: ['**/*.test.{ts,tsx}', 'test/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
})
