/**
 * Application Store
 * Manages global application state
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
}

export const useAppStore = defineStore('app', () => {
  // State
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const sidebarCollapsed = ref(false)

  // Computed
  const notificationCount = computed(() => notifications.value.length)

  // Actions
  const addNotification = (
    message: string,
    type: Notification['type'] = 'info',
    duration = 3000
  ) => {
    const id = `notif-${Date.now()}-${Math.random()}`
    const notification: Notification = {
      id,
      type,
      message,
      duration,
    }

    notifications.value.push(notification)
    logger.info(`Notification: ${type}`, message)

    if (duration > 0) {
      setTimeout(() => removeNotification(id), duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme.value)
    logger.debug(`Theme changed to ${theme.value}`)
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    logger.debug(`Theme set to ${newTheme}`)
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    // State
    notifications,
    isLoading,
    theme,
    sidebarCollapsed,

    // Computed
    notificationCount,

    // Actions
    addNotification,
    removeNotification,
    clearNotifications,
    setLoading,
    toggleTheme,
    setTheme,
    toggleSidebar,
  }
})
