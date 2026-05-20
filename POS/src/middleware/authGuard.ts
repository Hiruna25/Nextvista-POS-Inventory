/**
 * Authentication Guard/Middleware
 * Protects routes based on authentication and authorization
 */

import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'

export interface ProtectedRouteConfig {
  requireAuth?: boolean
  requiredRoles?: string[]
  requiredPermissions?: string[]
}

export const checkAuthentication = (config: ProtectedRouteConfig): boolean => {
  const authStore = useAuthStore()

  if (config.requireAuth && !authStore.isAuthenticated) {
    return false
  }

  if (config.requiredRoles && config.requiredRoles.length > 0) {
    const hasRole = config.requiredRoles.some((role) => authStore.user?.roles.includes(role))
    if (!hasRole) {
      return false
    }
  }

  if (config.requiredPermissions && config.requiredPermissions.length > 0) {
    const hasPermission = config.requiredPermissions.some((perm) =>
      authStore.user?.permissions.includes(perm)
    )
    if (!hasPermission) {
      return false
    }
  }

  return true
}

export const requireAuth = (): boolean => {
  return checkAuthentication({ requireAuth: true })
}

export const requireRole = (...roles: string[]): boolean => {
  return checkAuthentication({ requiredRoles: roles })
}

export const requirePermission = (...permissions: string[]): boolean => {
  return checkAuthentication({ requiredPermissions: permissions })
}

export const handleAuthGuardFailure = (reason: 'auth' | 'role' | 'permission') => {
  const appStore = useAppStore()
  const messages: Record<string, string> = {
    auth: 'Please login to access this resource',
    role: 'Your role does not have access to this resource',
    permission: 'You do not have permission to access this resource',
  }
  appStore.addNotification(messages[reason], 'error')
}
