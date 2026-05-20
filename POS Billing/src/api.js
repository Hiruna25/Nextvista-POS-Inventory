import axios from 'axios';

const STORAGE_KEY = 'posBillingApiConfig';
const DEFAULT_CONFIG = {
  endpoint: 'http://localhost:3001/api/external',
  apiKey: ''
};

export function getBillingConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.warn('Unable to read billing config from localStorage', error);
  }
  return DEFAULT_CONFIG;
}

export function saveBillingConfig(config) {
  const normalized = {
    endpoint: config.endpoint || DEFAULT_CONFIG.endpoint,
    apiKey: config.apiKey || ''
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function createApiClient() {
  const config = getBillingConfig();
  if (!config.apiKey) {
    throw new Error('Billing API key is not configured.');
  }

  return axios.create({
    baseURL: config.endpoint,
    headers: {
      'x-api-key': config.apiKey,
      'Content-Type': 'application/json'
    }
  });
}
