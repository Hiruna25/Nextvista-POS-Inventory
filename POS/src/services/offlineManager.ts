/**
 * Offline Detection and Cache Manager
 * Handles offline state and request caching
 */

import { ref, computed } from 'vue'
import { logger } from '@/utils/logger'

export interface CachedRequest {
  url: string
  method: string
  data?: unknown
  timestamp: number
  ttl: number // Time to live in milliseconds
}

class OfflineManager {
  private isOnline = ref(true)
  private cachedRequests = new Map<string, CachedRequest>()
  private offlineQueue: CachedRequest[] = []

  constructor() {
    this.setupNetworkListeners()
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())

    // Initial check
    this.isOnline.value = navigator.onLine
  }

  private handleOnline() {
    this.isOnline.value = true
    logger.info('Application back online')
    this.processOfflineQueue()
  }

  private handleOffline() {
    this.isOnline.value = false
    logger.warn('Application offline')
  }

  getOnlineStatus() {
    return computed(() => this.isOnline.value)
  }

  isConnected(): boolean {
    return this.isOnline.value
  }

  cacheRequest(request: CachedRequest): void {
    const key = `${request.method}:${request.url}`
    this.cachedRequests.set(key, request)
    logger.debug('Request cached', { key, ttl: request.ttl })
  }

  getCachedRequest(method: string, url: string): CachedRequest | undefined {
    const key = `${method}:${url}`
    const cached = this.cachedRequests.get(key)

    if (!cached) return undefined

    // Check if cache is expired
    const age = Date.now() - cached.timestamp
    if (age > cached.ttl) {
      this.cachedRequests.delete(key)
      return undefined
    }

    logger.debug('Cache hit', { key, age: `${age}ms` })
    return cached
  }

  addToOfflineQueue(request: CachedRequest): void {
    this.offlineQueue.push(request)
    logger.debug('Request added to offline queue', { url: request.url, queueSize: this.offlineQueue.length })
  }

  private async processOfflineQueue(): Promise<void> {
    if (this.offlineQueue.length === 0) return

    logger.info('Processing offline queue', { queueSize: this.offlineQueue.length })

    const queue = [...this.offlineQueue]
    this.offlineQueue = []

    for (const request of queue) {
      try {
        // Retry request here - implement based on your needs
        logger.debug('Retrying queued request', { url: request.url })
      } catch (error) {
        logger.error('Failed to process queued request', error)
        this.offlineQueue.push(request)
      }
    }
  }

  clearCache(): void {
    this.cachedRequests.clear()
    logger.info('Cache cleared')
  }

  getOfflineQueueSize(): number {
    return this.offlineQueue.length
  }
}

export const offlineManager = new OfflineManager()
export default offlineManager
