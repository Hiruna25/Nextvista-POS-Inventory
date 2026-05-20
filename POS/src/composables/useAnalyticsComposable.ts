/**
 * useAnalytics Composable
 * Provides analytics hooks for components
 */

import { analyticsService } from '@/services/analyticsService'
import type { AnalyticsEventName } from '@/services/analyticsService'

export const useAnalytics = () => {
  const trackEvent = (eventName: AnalyticsEventName, category?: string, data?: Record<string, unknown>) => {
    analyticsService.trackEvent(eventName, category, data)
  }

  const trackPageView = (pageName: string, path: string) => {
    analyticsService.trackPageView(pageName, path)
  }

  const trackProductView = (productId: string, productName: string) => {
    analyticsService.trackProductView(productId, productName)
  }

  const trackFeatureUsed = (featureName: string, metadata?: Record<string, unknown>) => {
    analyticsService.trackFeatureUsed(featureName, metadata)
  }

  const trackUserLogin = (username: string) => {
    analyticsService.trackUserLogin(username)
  }

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackFeatureUsed,
    trackUserLogin,
  }
}

export default useAnalytics
