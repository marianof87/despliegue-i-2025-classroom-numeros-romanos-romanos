// setup.ts

import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

// Limpia todos los mocks antes de cada test
beforeEach(() => {
  vi.clearAllMocks()
})
