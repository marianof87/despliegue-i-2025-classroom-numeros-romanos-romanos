import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts', // archivo opcional para configuración previa
    // include: ['src/**/*.{test,spec}.{ts,tsx}'], // opcional: patrones personalizados
  },
})
