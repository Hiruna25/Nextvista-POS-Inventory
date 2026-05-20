/**
 * Test: App Store
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAppStore } from '@/stores/app'

describe('App Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useAppStore()
    expect(store.notifications).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.theme).toBe('light')
    expect(store.sidebarCollapsed).toBe(false)
  })

  it('should add notifications', () => {
    const store = useAppStore()
    const id = store.addNotification('Test message', 'info')

    expect(store.notifications).toHaveLength(1)
    expect(store.notifications[0].message).toBe('Test message')
    expect(store.notifications[0].type).toBe('info')
    expect(id).toBeDefined()
  })

  it('should remove notifications', () => {
    const store = useAppStore()
    const id = store.addNotification('Test message', 'info', 0)

    expect(store.notifications).toHaveLength(1)
    store.removeNotification(id)
    expect(store.notifications).toHaveLength(0)
  })

  it('should clear all notifications', () => {
    const store = useAppStore()
    store.addNotification('Message 1', 'info', 0)
    store.addNotification('Message 2', 'error', 0)

    expect(store.notifications).toHaveLength(2)
    store.clearNotifications()
    expect(store.notifications).toHaveLength(0)
  })

  it('should toggle loading state', () => {
    const store = useAppStore()
    expect(store.isLoading).toBe(false)

    store.setLoading(true)
    expect(store.isLoading).toBe(true)

    store.setLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('should toggle theme', () => {
    const store = useAppStore()
    expect(store.theme).toBe('light')

    store.toggleTheme()
    expect(store.theme).toBe('dark')

    store.toggleTheme()
    expect(store.theme).toBe('light')
  })

  it('should set theme directly', () => {
    const store = useAppStore()
    store.setTheme('dark')
    expect(store.theme).toBe('dark')

    store.setTheme('light')
    expect(store.theme).toBe('light')
  })

  it('should toggle sidebar', () => {
    const store = useAppStore()
    expect(store.sidebarCollapsed).toBe(false)

    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(true)

    store.toggleSidebar()
    expect(store.sidebarCollapsed).toBe(false)
  })

  it('should calculate notification count', () => {
    const store = useAppStore()
    expect(store.notificationCount).toBe(0)

    store.addNotification('Message 1', 'info', 0)
    expect(store.notificationCount).toBe(1)

    store.addNotification('Message 2', 'error', 0)
    expect(store.notificationCount).toBe(2)
  })
})
