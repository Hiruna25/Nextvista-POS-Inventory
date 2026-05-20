/**
 * Environment Configuration Management
 * Centralized configuration for environment variables
 */

export const config = {
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'POS Inventory',
    env: import.meta.env.VITE_ENV || 'development',
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  },
  auth: {
    tokenStorageKey: import.meta.env.VITE_JWT_STORAGE_KEY || 'auth_token',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    supplierPortal: import.meta.env.VITE_ENABLE_SUPPLIER_PORTAL === 'true',
  },
}

export default config
