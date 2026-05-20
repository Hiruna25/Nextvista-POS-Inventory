/**
 * Router Type Augmentation
 * Extend RouteMeta with custom properties
 */

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiredRoles?: string[]
    requiredPermissions?: string[]
    title?: string
  }
}
