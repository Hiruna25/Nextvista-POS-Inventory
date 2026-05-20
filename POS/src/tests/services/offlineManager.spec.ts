/**
 * Test: Offline Manager
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { offlineManager } from '@/services/offlineManager'

describe('Offline Manager', () => {
  beforeEach(() => {
    offlineManager.clearCache()
  })

  it('should detect online status', () => {
    const status = offlineManager.isConnected()
    expect(typeof status).toBe('boolean')
  })

  it('should cache requests', () => {
    offlineManager.cacheRequest({
      url: '/api/products',
      method: 'GET',
      timestamp: Date.now(),
      ttl: 5000,
    })

    const cached = offlineManager.getCachedRequest('GET', '/api/products')
    expect(cached).toBeDefined()
    expect(cached?.url).toBe('/api/products')
  })

  it('should check cache expiration', () => {
    const expiredTime = Date.now() - 10000
    offlineManager.cacheRequest({
      url: '/api/products',
      method: 'GET',
      timestamp: expiredTime,
      ttl: 5000, // Already expired
    })

    const cached = offlineManager.getCachedRequest('GET', '/api/products')
    expect(cached).toBeUndefined()
  })

  it('should add requests to offline queue', () => {
    offlineManager.addToOfflineQueue({
      url: '/api/products',
      method: 'POST',
      data: { name: 'Product' },
      timestamp: Date.now(),
      ttl: 0,
    })

    const queueSize = offlineManager.getOfflineQueueSize()
    expect(queueSize).toBe(1)
  })

  it('should clear cache', () => {
    offlineManager.cacheRequest({
      url: '/api/products',
      method: 'GET',
      timestamp: Date.now(),
      ttl: 5000,
    })

    offlineManager.clearCache()
    const cached = offlineManager.getCachedRequest('GET', '/api/products')
    expect(cached).toBeUndefined()
  })

  it('should return online status', () => {
    const online = offlineManager.getOnlineStatus()
    expect(online).toBeDefined()
  })
})
