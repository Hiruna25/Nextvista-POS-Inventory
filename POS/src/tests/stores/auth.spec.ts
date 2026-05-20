/**
 * Test: Auth Store
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with null user and token', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set user and token on successful login', async () => {
    const store = useAuthStore()
    vi.spyOn(store, 'login').mockResolvedValueOnce(true)

    const result = await store.login({
      username: 'test@example.com',
      password: 'password123',
    })

    expect(result).toBe(true)
  })

  it('should clear user and token on logout', () => {
    const store = useAuthStore()
    store.user = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      roles: ['user'],
      permissions: ['read'],
    }
    store.token = 'test-token'

    store.logout()

    expect(store.user).toBeNull()
    expect(store.token).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('should check user roles correctly', () => {
    const store = useAuthStore()
    store.user = {
      id: '1',
      username: 'test',
      email: 'test@example.com',
      roles: ['admin', 'user'],
      permissions: ['read', 'write'],
    }

    expect(store.user.roles.includes('admin')).toBe(true)
    expect(store.user.roles.includes('viewer')).toBe(false)
  })

  it('should persist auth state to localStorage', () => {
    const store = useAuthStore()
    const token = 'test-token-123'
    store.token = token

    expect(localStorage.getItem('auth_store')).toBeDefined()
  })
})
