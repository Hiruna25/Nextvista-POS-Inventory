/**
 * Data Caching & Persistence Composable
 * Handles data caching, offline support, and automatic sync
 */

import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // milliseconds
}

class CacheManager {
  private cacheStore: Map<string, CacheEntry<any>> = new Map()

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000) {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    }

    // Store in memory
    this.cacheStore.set(key, entry)

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      logger.warn('Failed to persist cache to localStorage', error)
    }

    logger.debug('Cache set', { key, size: JSON.stringify(entry).length })
  }

  get<T>(key: string): T | null {
    let entry = this.cacheStore.get(key)

    // Try to load from localStorage if not in memory
    if (!entry) {
      try {
        const stored = localStorage.getItem(`cache_${key}`)
        if (stored) {
          entry = JSON.parse(stored)
          if (entry) {
            this.cacheStore.set(key, entry)
          }
        }
      } catch (error) {
        logger.warn('Failed to load cache from localStorage', error)
      }
    }

    if (!entry) {
      return null
    }

    // Check if cache has expired
    const now = Date.now()
    if (now - entry.timestamp > entry.ttl) {
      this.remove(key)
      return null
    }

    logger.debug('Cache hit', { key })
    return entry.data
  }

  remove(key: string) {
    this.cacheStore.delete(key)
    try {
      localStorage.removeItem(`cache_${key}`)
    } catch (error) {
      logger.warn('Failed to remove cache from localStorage', error)
    }
    logger.debug('Cache removed', { key })
  }

  clear() {
    this.cacheStore.clear()
    try {
      const keysToRemove = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
      keysToRemove.forEach(key => localStorage.removeItem(key))
    } catch (error) {
      logger.warn('Failed to clear localStorage cache', error)
    }
    logger.info('Cache cleared')
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  size(): number {
    return this.cacheStore.size
  }
}

// Global cache manager instance
const cacheManager = new CacheManager()

/**
 * Composable for managing cached API calls
 * @example
 * const { cachedFetch, clearCache } = useCachedData()
 * const data = await cachedFetch('products', () => apiService.get('/products'), 5 * 60 * 1000)
 */
export function useCachedData() {
  const isSyncing = ref(false)
  const lastSyncTime = ref<Record<string, number>>({})

  const cachedFetch = async <T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> => {
    // Check if we have valid cached data
    const cached = cacheManager.get<T>(cacheKey)
    if (cached) {
      logger.debug('Returning cached data', { key: cacheKey })
      return cached
    }

    // Fetch fresh data
    try {
      isSyncing.value = true
      const data = await fetchFn()
      
      // Cache the result
      cacheManager.set(cacheKey, data, ttl)
      lastSyncTime.value[cacheKey] = Date.now()
      
      logger.info('Data fetched and cached', { key: cacheKey })
      return data
    } catch (error) {
      logger.error('Error fetching data', { key: cacheKey, error })
      throw error
    } finally {
      isSyncing.value = false
    }
  }

  const invalidateCache = (cacheKey: string) => {
    cacheManager.remove(cacheKey)
    logger.debug('Cache invalidated', { key: cacheKey })
  }

  const clearAllCache = () => {
    cacheManager.clear()
    lastSyncTime.value = {}
  }

  const getCacheStatus = computed(() => ({
    size: cacheManager.size(),
    isSyncing: isSyncing.value,
    lastSyncTime: lastSyncTime.value
  }))

  return {
    cachedFetch,
    invalidateCache,
    clearAllCache,
    getCacheStatus,
    isSyncing
  }
}

/**
 * Offline support composable
 * Detects online/offline status and queues operations for offline use
 */
export function useOfflineSupport() {
  const isOnline = ref(navigator.onLine)
  const pendingOperations = ref<Array<{ key: string; fn: () => Promise<any> }>>([])

  // Listen for online/offline events
  window.addEventListener('online', () => {
    isOnline.value = true
    logger.info('App is back online')
    syncPendingOperations()
  })

  window.addEventListener('offline', () => {
    isOnline.value = false
    logger.warn('App is offline')
  })

  const queueOperation = (key: string, fn: () => Promise<any>) => {
    pendingOperations.value.push({ key, fn })
    logger.debug('Operation queued for offline', { key })
  }

  const syncPendingOperations = async () => {
    if (!isOnline.value || pendingOperations.value.length === 0) {
      return
    }

    logger.info('Syncing pending operations', { count: pendingOperations.value.length })

    const operations = [...pendingOperations.value]
    pendingOperations.value = []

    for (const op of operations) {
      try {
        await op.fn()
        logger.debug('Operation synced successfully', { key: op.key })
      } catch (error) {
        logger.error('Error syncing operation', { key: op.key, error })
        // Re-queue if sync fails
        pendingOperations.value.push(op)
      }
    }
  }

  return {
    isOnline,
    pendingOperations,
    queueOperation,
    syncPendingOperations
  }
}

/**
 * Data synchronization composable
 * Handles periodic syncing and conflict resolution
 */
export function useSyncManager(syncInterval: number = 30 * 1000) {
  const { invalidateCache } = useCachedData()
  const syncTimers = ref<Record<string, any>>({})

  const startSync = (key: string, fetchFn: () => Promise<any>, interval: number = syncInterval) => {
    // Initial sync
    fetchFn()

    // Periodic sync
    if (syncTimers.value[key]) {
      clearInterval(syncTimers.value[key])
    }

    syncTimers.value[key] = setInterval(() => {
      invalidateCache(key)
      fetchFn()
    }, interval)

    logger.info('Sync started', { key, interval })
  }

  const stopSync = (key: string) => {
    if (syncTimers.value[key]) {
      clearInterval(syncTimers.value[key])
      delete syncTimers.value[key]
      logger.info('Sync stopped', { key })
    }
  }

  const stopAllSync = () => {
    Object.keys(syncTimers.value).forEach(key => stopSync(key))
  }

  return {
    startSync,
    stopSync,
    stopAllSync
  }
}

export { cacheManager }
