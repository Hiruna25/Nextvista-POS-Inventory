/**
 * Authentication Store
 * Manages user authentication state and tokens
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { config } from '@/config/env'
import { apiService } from '@/services/api'
import { logger } from '@/utils/logger'

const DUMMY_AUTH_USER = {
  id: 'admin-1',
  username: 'Admin',
  email: 'admin@example.com',
  roles: ['admin'],
  permissions: ['manage_products', 'manage_inventory', 'view_reports'],
}

const DUMMY_AUTH_CREDENTIALS = {
  username: 'Admin',
  password: 'Admin123',
}

export interface User {
  id: string
  username: string
  email: string
  roles: string[]
  permissions: string[]
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const useAuthStore = defineStore(
  'auth',
  () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(localStorage.getItem(config.auth.tokenStorageKey))
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const isAuthenticated = computed(() => !!token.value && !!user.value)
    
    // Methods for checking roles and permissions
    const hasRole = (role: string): boolean => user.value?.roles?.includes(role) ?? false
    const hasPermission = (permission: string): boolean =>
      user.value?.permissions?.includes(permission) ?? false

    // Actions
    const login = async (credentials: LoginCredentials) => {
      try {
        isLoading.value = true
        error.value = null

        const response = await apiService.post<LoginResponse>('/auth/login', credentials, {
          skipAuth: true,
        })

        if (response.success && response.data) {
          token.value = response.data.token
          user.value = response.data.user
          localStorage.setItem(config.auth.tokenStorageKey, response.data.token)
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
          logger.success('User logged in', { username: user.value.username })
          return true
        }

        const isLocalDummyLogin =
          credentials.username === DUMMY_AUTH_CREDENTIALS.username &&
          credentials.password === DUMMY_AUTH_CREDENTIALS.password

        const backendUnavailable = response.error
          ? ['network', 'refused', 'connect', 'failed to fetch'].some((term) =>
              response.error!.toLowerCase().includes(term)
            )
          : false

        if (isLocalDummyLogin && backendUnavailable) {
          token.value = 'demo-admin-token'
          user.value = DUMMY_AUTH_USER
          localStorage.setItem(config.auth.tokenStorageKey, token.value)
          logger.success('Dummy admin logged in locally', { username: user.value.username })
          return true
        }

        error.value = response.error || 'Login failed'
        logger.warn('Login failed', error.value)
        return false
      } catch (err) {
        // Allow demo login when backend is not available
        if (
          credentials.username === DUMMY_AUTH_CREDENTIALS.username &&
          credentials.password === DUMMY_AUTH_CREDENTIALS.password
        ) {
          token.value = 'demo-admin-token'
          user.value = DUMMY_AUTH_USER
          localStorage.setItem(config.auth.tokenStorageKey, token.value)
          logger.success('Dummy admin logged in locally', { username: user.value.username })
          return true
        }

        error.value = err instanceof Error ? err.message : 'Login error'
        logger.error('Login error', err)
        return false
      } finally {
        isLoading.value = false
      }
    }

    const logout = async () => {
      return new Promise<void>((resolve) => {
        user.value = null
        token.value = null
        localStorage.removeItem(config.auth.tokenStorageKey)
        localStorage.removeItem('user_data')
        logger.success('User logged out successfully')
        resolve()
      })
    }

    const refreshToken = async () => {
      try {
        const response = await apiService.post<LoginResponse>('/auth/refresh')

        if (response.success && response.data) {
          token.value = response.data.token
          user.value = response.data.user
          localStorage.setItem(config.auth.tokenStorageKey, response.data.token)
          logger.success('Token refreshed')
          return true
        } else {
          logout()
          return false
        }
      } catch (err) {
        logger.error('Token refresh failed', err)
        logout()
        return false
      }
    }

    const setUser = (newUser: User) => {
      user.value = newUser
    }

    const initializeAuth = () => {
      const savedToken = localStorage.getItem(config.auth.tokenStorageKey)
      const savedUser = localStorage.getItem('user_data')
      
      if (savedToken) {
        token.value = savedToken
        logger.info('Auth token restored from storage')
      }
      
      if (savedUser) {
        try {
          user.value = JSON.parse(savedUser)
          logger.info('User data restored from storage')
        } catch (err) {
          logger.error('Failed to parse stored user data', err)
          localStorage.removeItem('user_data')
        }
      }
    }

    return {
      // State
      user,
      token,
      isLoading,
      error,

      // Computed
      isAuthenticated,
      hasRole,
      hasPermission,

      // Actions
      login,
      logout,
      refreshToken,
      setUser,
      initializeAuth,
    }
  }
)
