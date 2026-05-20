/**
 * useAuth Composable
 * Provides authentication utilities for components
 */

import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { logger } from '@/utils/logger'

export const useAuth = () => {
  const authStore = useAuthStore()
  const appStore = useAppStore()

  const login = async (username: string, password: string) => {
    const success = await authStore.login({ username, password })
    if (success) {
      appStore.addNotification('Login successful!', 'success')
    } else {
      appStore.addNotification(authStore.error || 'Login failed', 'error')
    }
    return success
  }

  const logout = () => {
    authStore.logout()
    appStore.addNotification('Logged out successfully', 'info')
  }

  const checkPermission = (permission: string) => {
    const hasPermission = authStore.user?.permissions.includes(permission) ?? false
    if (!hasPermission) {
      logger.warn(`Access denied for permission: ${permission}`)
    }
    return hasPermission
  }

  const checkRole = (role: string) => {
    return authStore.user?.roles.includes(role) ?? false
  }

  return {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    isLoading: authStore.isLoading,
    login,
    logout,
    checkPermission,
    checkRole,
  }
}

export default useAuth
