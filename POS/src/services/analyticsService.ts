/**
 * Analytics Service
 * Tracks user interactions and events
 */

import { logger } from '@/utils/logger'
import { v4 as uuidv4 } from 'uuid'

export interface AnalyticsEvent {
  eventId: string
  eventName: string
  category: string
  timestamp: number
  data?: Record<string, unknown>
  userId?: string
}

export type AnalyticsEventName =
  | 'page_view'
  | 'user_login'
  | 'user_logout'
  | 'product_viewed'
  | 'product_created'
  | 'product_updated'
  | 'product_deleted'
  | 'inventory_adjusted'
  | 'supplier_created'
  | 'error_occurred'
  | 'feature_used'

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private userId: string | null = null
  private sessionId: string = uuidv4()
  private isEnabled: boolean = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

  constructor() {
    logger.info('Analytics service initialized', { enabled: this.isEnabled, sessionId: this.sessionId })
  }

  setUserId(userId: string): void {
    this.userId = userId
    logger.debug('Analytics user ID set', { userId })
  }

  trackEvent(eventName: AnalyticsEventName, category: string = 'general', data?: Record<string, unknown>): void {
    if (!this.isEnabled) return

    const event: AnalyticsEvent = {
      eventId: uuidv4(),
      eventName,
      category,
      timestamp: Date.now(),
      data,
      userId: this.userId || undefined,
    }

    this.events.push(event)
    logger.debug('Event tracked', { eventName, category, dataKeys: data ? Object.keys(data) : [] })

    // Send to analytics backend if batch is large enough
    if (this.events.length >= 10) {
      this.flushEvents()
    }
  }

  trackPageView(pageName: string, path: string): void {
    this.trackEvent('page_view', 'navigation', {
      pageName,
      path,
      sessionId: this.sessionId,
    })
  }

  trackProductView(productId: string, productName: string): void {
    this.trackEvent('product_viewed', 'product', {
      productId,
      productName,
    })
  }

  trackProductCreated(productId: string, productName: string): void {
    this.trackEvent('product_created', 'product', {
      productId,
      productName,
    })
  }

  trackUserLogin(username: string): void {
    this.trackEvent('user_login', 'auth', {
      username,
    })
  }

  trackUserLogout(): void {
    this.trackEvent('user_logout', 'auth')
  }

  trackError(errorName: string, errorMessage: string, stack?: string): void {
    this.trackEvent('error_occurred', 'error', {
      errorName,
      errorMessage,
      stack,
    })
  }

  trackFeatureUsed(featureName: string, metadata?: Record<string, unknown>): void {
    this.trackEvent('feature_used', 'feature', {
      featureName,
      ...metadata,
    })
  }

  async flushEvents(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    try {
      // Send to analytics backend
      // await apiService.post('/analytics/events', { events: eventsToSend })
      logger.debug('Events flushed to backend', { count: eventsToSend.length })
    } catch (error) {
      logger.error('Failed to flush analytics events', error)
      // Re-add events if sending fails
      this.events = [...eventsToSend, ...this.events]
    }
  }

  getSessionId(): string {
    return this.sessionId
  }

  getEventCount(): number {
    return this.events.length
  }

  disable(): void {
    this.isEnabled = false
    this.flushEvents()
    logger.info('Analytics disabled')
  }

  enable(): void {
    this.isEnabled = true
    logger.info('Analytics enabled')
  }
}

export const analyticsService = new AnalyticsService()
export default analyticsService
