/**
 * Test: Error Handler Utility
 */

import { describe, it, expect } from 'vitest'
import {
  AppError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  handleError,
  showErrorNotification,
} from '@/utils/errorHandler'

describe('Error Handler', () => {
  describe('Error Classes', () => {
    it('should create AppError', () => {
      const error = new AppError('TEST_ERROR', 400, 'Test error message')
      expect(error.code).toBe('TEST_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Test error message')
    })

    it('should create NetworkError', () => {
      const error = new NetworkError('Network failed')
      expect(error.code).toBe('NETWORK_ERROR')
      expect(error.statusCode).toBe(0)
      expect(error.message).toBe('Network failed')
    })

    it('should create ValidationError', () => {
      const error = new ValidationError('Invalid input')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
      expect(error.message).toBe('Invalid input')
    })

    it('should create AuthenticationError', () => {
      const error = new AuthenticationError()
      expect(error.code).toBe('AUTH_ERROR')
      expect(error.statusCode).toBe(401)
      expect(error.message).toBe('Authentication failed')
    })
  })

  describe('handleError', () => {
    it('should return AppError if input is AppError', () => {
      const appError = new AppError('TEST', 400, 'Test')
      const result = handleError(appError)
      expect(result).toBe(appError)
    })

    it('should wrap Error in AppError', () => {
      const error = new Error('Test error')
      const result = handleError(error)
      expect(result).toBeInstanceOf(AppError)
      expect(result.message).toBe('Test error')
    })

    it('should handle unknown error types', () => {
      const result = handleError('Unknown error')
      expect(result).toBeInstanceOf(AppError)
      expect(result.code).toBe('UNKNOWN_ERROR')
    })
  })

  describe('showErrorNotification', () => {
    it('should return user-friendly message for NETWORK_ERROR', () => {
      const error = new NetworkError('Network failed')
      const message = showErrorNotification(error)
      expect(message).toContain('Network connection error')
    })

    it('should return user-friendly message for AUTH_ERROR', () => {
      const error = new AuthenticationError()
      const message = showErrorNotification(error)
      expect(message).toContain('Authentication failed')
    })

    it('should return original message if no mapping exists', () => {
      const error = new AppError('UNKNOWN_CODE', 500, 'Custom message')
      const message = showErrorNotification(error)
      expect(message).toBe('Custom message')
    })
  })
})
