/**
 * Test: Logger Utility
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { logger } from '@/utils/logger'

describe('Logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should log info messages', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    logger.info('Test info message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log warn messages', () => {
    const consoleSpy = vi.spyOn(console, 'warn')
    logger.warn('Test warning message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log error messages', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    logger.error('Test error message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should log success messages', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    logger.success('Test success message')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should include data in logs', () => {
    const consoleSpy = vi.spyOn(console, 'log')
    const testData = { key: 'value' }
    logger.info('Test message', testData)
    expect(consoleSpy).toHaveBeenCalled()
  })
})
