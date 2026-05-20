/**
 * Vitest Setup File
 * Global test configuration and setup
 */

import { vi } from 'vitest'
import { config } from 'dotenv'

declare global {
  var testUtils: {
    flushPromises: () => Promise<void>
  }
}

// Load environment variables from .env.example for tests
config({ path: '.env.example' })

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = String(value)
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Setup global test utilities
globalThis.testUtils = {
  flushPromises: () => new Promise((resolve) => setTimeout(resolve, 0)),
}
