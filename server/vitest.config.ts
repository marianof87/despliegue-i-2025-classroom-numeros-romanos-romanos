import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.test.ts'],
    // coverage solo se pasa como objeto, con tipos correctos
    coverage: {
      provider: 'c8',              // motor de coverage
      reporter: ['text', 'lcov'],  // consola + HTML
      all: true,                    // analiza todos los archivos, no solo los testeados
      include: ['src/**/*.ts'],     // archivos a medir
      exclude: ['node_modules', 'tests/**', 'coverage/**'],
    },
  },
})
