/**
 * Logger Utility
 * Centralized logging with support for different log levels
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
}

class Logger {
  private isDev: boolean

  constructor(isDev: boolean = import.meta.env.DEV) {
    this.isDev = isDev
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
  }

  private getConsoleColor(level: LogLevel): string {
    const colors: Record<LogLevel, string> = {
      info: '#0070f3',
      warn: '#ff9500',
      error: '#f81d7a',
      debug: '#7c3aed',
      success: '#10b981',
    }
    return colors[level]
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const entry = this.formatLog(level, message, data)
    const color = this.getConsoleColor(level)
    const prefix = `%c[${level.toUpperCase()}]`

    if (this.isDev) {
      console.log(
        `${prefix} ${entry.timestamp} - ${message}`,
        `color: ${color}; font-weight: bold;`,
        data
      )
    } else {
      // In production, use native console but without styling
      console[level === 'success' ? 'log' : level](
        `[${level.toUpperCase()}] ${message}`,
        data
      )
    }
  }

  info(message: string, data?: unknown) {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown) {
    this.log('warn', message, data)
  }

  error(message: string, data?: unknown) {
    this.log('error', message, data)
  }

  debug(message: string, data?: unknown) {
    if (this.isDev) {
      this.log('debug', message, data)
    }
  }

  success(message: string, data?: unknown) {
    this.log('success', message, data)
  }
}

export const logger = new Logger()
export default logger
