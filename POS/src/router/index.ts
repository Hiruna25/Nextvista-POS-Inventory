/**
 * Vue Router Configuration
 * Routes with authentication guards and middleware
 */

import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { logger } from '@/utils/logger'

// Lazy-load components for better code splitting
const Login = () => import('@/pages/Login.vue')
const Layout = () => import('@/components/shared/Layout.vue')
const Dashboard = () => import('@/pages/Dashboard.vue')
const Products = () => import('@/pages/Products.vue')
const Inventory = () => import('@/pages/Inventory.vue')
const Suppliers = () => import('@/pages/Suppliers.vue')
const SupplierOrders = () => import('@/pages/SupplierOrders.vue')
const Transactions = () => import('@/pages/Transactions.vue')
const Reports = () => import('@/pages/Reports.vue')
const Users = () => import('@/pages/Users.vue')
const Settings = () => import('@/pages/Settings.vue')
const NotFound = () => import('@/pages/NotFound.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Login - POS Inventory',
    },
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard - POS Inventory',
        },
      },
      {
        path: 'products',
        name: 'Products',
        component: Products,
        meta: {
          title: 'Products - POS Inventory',
          requiredPermissions: ['manage_products'],
        },
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory,
        meta: {
          title: 'Inventory - POS Inventory',
          requiredPermissions: ['manage_inventory'],
        },
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: Suppliers,
        meta: {
          title: 'Suppliers - POS Inventory',
        },
      },
      {
        path: 'supplier-orders',
        name: 'SupplierOrders',
        component: SupplierOrders,
        meta: {
          title: 'Supplier Orders - POS Inventory',
        },
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions,
        meta: {
          title: 'Transactions - POS Inventory',
        },
      },
      {
        path: 'reports',
        name: 'Reports',
        component: Reports,
        meta: {
          title: 'Reports - POS Inventory',
          requiredPermissions: ['view_reports'],
        },
      },
      {
        path: 'users',
        name: 'Users',
        component: Users,
        meta: {
          title: 'Users - POS Inventory',
          requiredRoles: ['admin'],
          requiredPermissions: ['manage_users'],
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
        meta: {
          title: 'Settings - POS Inventory',
          requiredRoles: ['admin'],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Page Not Found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/**
 * Global Route Guard
 * Handles authentication, authorization, and route meta updates
 */
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore()
    const appStore = useAppStore()

    // Update document title
    if (to.meta.title) {
      document.title = String(to.meta.title)
    }

    const requiresAuth = to.meta.requiresAuth === true
    const requiredRoles = to.meta.requiredRoles as string[] | undefined
    const requiredPermissions = to.meta.requiredPermissions as string[] | undefined

    logger.debug('Route guard check', {
      to: to.name,
      from: from.name,
      requiresAuth,
      isAuthenticated: authStore.isAuthenticated,
    })

    // Check authentication requirement
    if (requiresAuth && !authStore.isAuthenticated) {
      logger.warn('Unauthenticated access attempt', { route: to.name })
      appStore.addNotification('Please login to access this page', 'warning')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Check role requirement
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.some((role) => authStore.user?.roles.includes(role))
      if (!hasRole) {
        logger.warn('Insufficient role', { route: to.name, requiredRoles })
        appStore.addNotification('You do not have the required role to access this page', 'error')
        next(false)
        return
      }
    }

    // Check permission requirement
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some((perm) =>
        authStore.user?.permissions.includes(perm)
      )
      if (!hasPermission) {
        logger.warn('Insufficient permission', { route: to.name, requiredPermissions })
        appStore.addNotification('You do not have the required permission to access this page', 'error')
        next(false)
        return
      }
    }

    // Redirect authenticated users away from login page
    if (to.name === 'Login' && authStore.isAuthenticated) {
      logger.debug('Authenticated user redirected from login to dashboard')
      next({ name: 'Dashboard' })
      return
    }

    // Allow unauthenticated users to access login page
    if (to.name === 'Login' && !authStore.isAuthenticated) {
      logger.debug('Allowing unauthenticated access to login page')
      next()
      return
    }

    // Allow all other routes to proceed (they've passed the checks above)
    next()
  }
)

/**
 * After route change
 * Handle post-navigation tasks
 */
router.afterEach((to, from) => {
  logger.debug('Route changed', { from: from.name, to: to.name })

  // Scroll to top
  window.scrollTo(0, 0)
})

export default router
