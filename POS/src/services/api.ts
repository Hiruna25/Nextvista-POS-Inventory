/**
 * API Service Layer
 * Centralized API client with interceptors for authentication, error handling, and retries
 */

import axios from 'axios'
import type { AxiosInstance, AxiosError } from 'axios'
import axiosRetry from 'axios-retry'
import { config } from '@/config/env'
import { logger } from '@/utils/logger'
import { handleError, AuthenticationError } from '@/utils/errorHandler'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiRequestConfig {
  skipAuth?: boolean
  skipErrorHandling?: boolean
  params?: Record<string, unknown>
}

class ApiService {
  private axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
    this.setupRetry()
  }

  private setupInterceptors() {
    // Request Interceptor
    this.axiosInstance.interceptors.request.use(
      (requestConfig) => {
        const token = localStorage.getItem(config.auth.tokenStorageKey)
        if (token) {
          requestConfig.headers.Authorization = `Bearer ${token}`
        }
        logger.debug('API Request', { method: requestConfig.method, url: requestConfig.url })
        return requestConfig
      },
      (error) => {
        logger.error('Request interceptor error', error)
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
        })
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear auth token and redirect to login
          localStorage.removeItem(config.auth.tokenStorageKey)
          logger.warn('Unauthorized - clearing token')
          // You can emit an event or use a state management system to handle this
          window.dispatchEvent(new CustomEvent('auth:unauthorized'))
          return Promise.reject(new AuthenticationError('Session expired. Please login again.'))
        }

        logger.error('API Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
        })

        return Promise.reject(handleError(error))
      }
    )
  }

  private setupRetry() {
    // Retry configuration: retry on network errors and 5xx responses
    axiosRetry(this.axiosInstance, {
      retries: 3,
      retryDelay: (retryCount: number) => {
        return retryCount * 1000 // 1s, 2s, 3s
      },
      retryCondition: (error: any) => {
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          (error.response?.status !== undefined && error.response.status >= 500)
        )
      },
    })
  }

  private parseResponse<T>(response: any): ApiResponse<T> {
    const payload = response.data
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (payload.data !== undefined) {
        return {
          success: payload.success,
          data: payload.data,
          error: payload.success ? undefined : payload.message || payload.error || 'Unknown error',
        }
      }

      const { success, ...rest } = payload
      return {
        success: payload.success,
        data: rest as T,
        error: payload.success ? undefined : payload.message || payload.error || 'Unknown error',
      }
    }

    return {
      success: true,
      data: response.data,
    }
  }

  async get<T = unknown>(
    url: string,
    options?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get<T>(url, {
        params: options?.params,
      })
      return this.parseResponse<T>(response)
    } catch (error) {
      if (!options?.skipErrorHandling) {
        const appError = error instanceof Error ? error : handleError(error)
        return {
          success: false,
          error: appError.message,
        }
      }
      throw error
    }
  }

  async post<T = unknown>(
    url: string,
    data?: unknown,
    options?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post<T>(url, data)
      return this.parseResponse<T>(response)
    } catch (error) {
      if (!options?.skipErrorHandling) {
        const appError = error instanceof Error ? error : handleError(error)
        return {
          success: false,
          error: appError.message,
        }
      }
      throw error
    }
  }

  async put<T = unknown>(
    url: string,
    data?: unknown,
    options?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      console.log(`🔄 API PUT: ${url}`)
      console.log('📤 Request data:', data)

      const response = await this.axiosInstance.put<T>(url, data)

      console.log('✅ API Response:', response.data)
      return this.parseResponse<T>(response)
    } catch (error) {
      console.error(`❌ API PUT error on ${url}:`, error)

      if (!options?.skipErrorHandling) {
        const appError = error instanceof Error ? error : handleError(error)
        console.error('Error details:', appError.message)
        return {
          success: false,
          error: appError.message,
        }
      }
      throw error
    }
  }

  async delete<T = unknown>(
    url: string,
    options?: ApiRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<T>(url)
      return this.parseResponse<T>(response)
    } catch (error) {
      if (!options?.skipErrorHandling) {
        const appError = error instanceof Error ? error : handleError(error)
        return {
          success: false,
          error: appError.message,
        }
      }
      throw error
    }
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }
}

export const apiService = new ApiService()
export default apiService
