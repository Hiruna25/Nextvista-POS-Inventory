/**
 * Error Handler Utility
 * Centralized error handling and custom error types
 */

import { logger } from './logger'

export class AppError extends Error {
  public code: string
  public statusCode: number
  public details?: unknown

  constructor(code: string, statusCode: number, message: string, details?: unknown) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: unknown) {
    super('NETWORK_ERROR', 0, message, details)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', 400, message, details)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', details?: unknown) {
    super('AUTH_ERROR', 401, message, details)
    this.name = 'AuthenticationError'
    Object.setPrototypeOf(this, AuthenticationError.prototype)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', details?: unknown) {
    super('AUTHZ_ERROR', 403, message, details)
    this.name = 'AuthorizationError'
    Object.setPrototypeOf(this, AuthorizationError.prototype)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super('NOT_FOUND', 404, message, details)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Server error occurred', details?: unknown) {
    super('SERVER_ERROR', 500, message, details)
    this.name = 'ServerError'
    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    logger.error(`${error.name}: ${error.message}`, error.details)
    return error
  }

  if (error instanceof Error) {
    logger.error(`Unexpected Error: ${error.message}`)
    return new AppError(
      'UNKNOWN_ERROR',
      500,
      error.message,
      { originalError: error }
    )
  }

  const message = String(error)
  logger.error(`Unknown Error: ${message}`)
  return new AppError(
    'UNKNOWN_ERROR',
    500,
    'An unexpected error occurred',
    { originalError: error }
  )
}

export const showErrorNotification = (error: AppError | unknown): string => {
  const appError = error instanceof AppError ? error : handleError(error)
  
  // Map error codes to user-friendly messages
  const userMessages: Record<string, string> = {
    NETWORK_ERROR: 'Network connection error. Please check your connection.',
    AUTH_ERROR: 'Authentication failed. Please login again.',
    AUTHZ_ERROR: 'You do not have permission to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
  }

  return userMessages[appError.code] || appError.message || 'An error occurred'
}
