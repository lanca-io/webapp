import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
})
