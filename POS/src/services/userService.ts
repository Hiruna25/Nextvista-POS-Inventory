/**
 * User Service
 * API service for user-related operations
 */

import { apiService } from '@/services/api'
import { validateSchema, LoginSchema } from '@/schemas/validation'
import type { User, LoginInput } from '@/schemas/validation'
import { logger } from '@/utils/logger'

export interface LoginResponse {
  token: string
  user: User
}

export interface UsersResponse {
  data: User[]
  total: number
  page: number
  limit: number
  success: boolean
}

class UserService {
  async login(credentials: LoginInput): Promise<LoginResponse | null> {
    try {
      // Validate input
      const validation = await validateSchema(LoginSchema, credentials)
      if (!validation.success) {
        logger.warn('Login validation failed', validation.errors)
        throw new Error(Object.values(validation.errors || {}).join(', '))
      }

      const response = await apiService.post<LoginResponse>('/auth/login', credentials, {
        skipAuth: true,
      })

      if (response.success && response.data) {
        logger.success('User login successful', { username: credentials.username })
        return response.data
      }

      logger.warn('Login failed', response.error)
      return null
    } catch (error) {
      logger.error('Login error', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout')
      logger.info('User logout successful')
    } catch (error) {
      logger.error('Logout error', error)
      // Don't throw on logout failure
    }
  }

  async refreshToken(): Promise<LoginResponse | null> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/refresh')

      if (response.success && response.data) {
        logger.success('Token refreshed')
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Token refresh error', error)
      return null
    }
  }

  async getProfile(): Promise<User | null> {
    try {
      const response = await apiService.get<User>('/users/profile')

      if (response.success && response.data) {
        logger.debug('Profile fetched')
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Get profile error', error)
      return null
    }
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    try {
      const response = await apiService.put<User>('/users/profile', updates)

      if (response.success && response.data) {
        logger.success('Profile updated')
        return response.data
      }

      return null
    } catch (error) {
      logger.error('Update profile error', error)
      return null
    }
  }

  // Get all users (admin only)
  async getAllUsers(page: number = 1, limit: number = 10): Promise<UsersResponse | null> {
    try {
      const response = await apiService.get<UsersResponse>('/users', {
        params: { page, limit }
      })

      if (response.success && response.data) {
        logger.debug('All users fetched', { count: response.data.data?.length || 0 })
        return response.data
      }

      logger.warn('Failed to fetch users', response.error)
      return null
    } catch (error) {
      logger.error('Get all users error', error)
      return null
    }
  }

  // Get user by ID (admin only)
  async getUserById(id: string): Promise<User | null> {
    try {
      const response = await apiService.get<User>(`/users/${id}`)

      if (response.success && response.data) {
        logger.debug('User fetched by ID', { id })
        return response.data
      }

      logger.warn('Failed to fetch user', { id, error: response.error })
      return null
    } catch (error) {
      logger.error('Get user by ID error', error)
      return null
    }
  }

  // Create user (admin only)
  async createUser(userData: Partial<User>): Promise<User | null> {
    try {
      const response = await apiService.post<User>('/users', userData)

      if (response.success && response.data) {
        logger.success('User created', { username: userData.username })
        return response.data
      }

      logger.warn('Failed to create user', response.error)
      return null
    } catch (error) {
      logger.error('Create user error', error)
      throw error
    }
  }

  // Update user (admin only)
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await apiService.put<User>(`/users/${id}`, userData)

      if (response.success && response.data) {
        logger.success('User updated', { id })
        return response.data
      }

      logger.warn('Failed to update user', response.error)
      return null
    } catch (error) {
      logger.error('Update user error', error)
      throw error
    }
  }

  // Delete user (admin only)
  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await apiService.delete(`/users/${id}`)

      if (response.success) {
        logger.success('User deleted', { id })
        return true
      }

      logger.warn('Failed to delete user', response.error)
      return false
    } catch (error) {
      logger.error('Delete user error', error)
      throw error
    }
  }
}

export const userService = new UserService()
export default userService
