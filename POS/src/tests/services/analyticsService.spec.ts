/**
 * Test: Analytics Service
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { analyticsService } from '@/services/analyticsService'

describe('Analytics Service', () => {
  beforeEach(() => {
    // Reset analytics for each test
    vi.clearAllMocks()
  })

  it('should track events', () => {
    analyticsService.enable()
    analyticsService.trackEvent('page_view', 'navigation', { path: '/dashboard' })
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })

  it('should track page views', () => {
    analyticsService.enable()
    analyticsService.trackPageView('Dashboard', '/dashboard')
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })

  it('should track user login', () => {
    analyticsService.enable()
    analyticsService.trackUserLogin('testuser')
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })

  it('should track user logout', () => {
    analyticsService.enable()
    analyticsService.trackUserLogout()
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })

  it('should set user ID', () => {
    analyticsService.setUserId('user-123')
    // SessionId should be set
    const sessionId = analyticsService.getSessionId()
    expect(sessionId).toBeDefined()
    expect(typeof sessionId).toBe('string')
  })

  it('should track features', () => {
    analyticsService.enable()
    analyticsService.trackFeatureUsed('export_data', { format: 'csv' })
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })

  it('should disable analytics', () => {
    analyticsService.disable()
    const countBefore = analyticsService.getEventCount()
    analyticsService.trackEvent('page_view', 'navigation')
    const countAfter = analyticsService.getEventCount()
    expect(countAfter).toBe(countBefore)
  })

  it('should track errors', () => {
    analyticsService.enable()
    analyticsService.trackError('TestError', 'This is a test error', 'stack trace')
    expect(analyticsService.getEventCount()).toBeGreaterThan(0)
  })
})
