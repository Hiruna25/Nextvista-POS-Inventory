/**
 * useApi Composable
 * Provides API utilities for components
 */

import { ref } from 'vue'
import { apiService } from '@/services/api'
import { useAppStore } from '@/stores/app'
import { handleError } from '@/utils/errorHandler'

export const useApi = () => {
  const appStore = useAppStore()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const request = async <T = unknown>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: unknown
  ): Promise<T | null> => {
    try {
      isLoading.value = true
      error.value = null

      let response
      switch (method) {
        case 'get':
          response = await apiService.get<T>(url)
          break
        case 'post':
          response = await apiService.post<T>(url, data)
          break
        case 'put':
          response = await apiService.put<T>(url, data)
          break
        case 'delete':
          response = await apiService.delete<T>(url)
          break
      }

      if (response.success && response.data) {
        return response.data
      } else {
        error.value = response.error || 'Request failed'
        appStore.addNotification(error.value, 'error')
        return null
      }
    } catch (err) {
      const appError = handleError(err)
      error.value = appError.message
      appStore.addNotification(error.value, 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  const get = <T = unknown>(url: string) => request<T>('get', url)
  const post = <T = unknown>(url: string, data?: unknown) => request<T>('post', url, data)
  const put = <T = unknown>(url: string, data?: unknown) => request<T>('put', url, data)
  const remove = <T = unknown>(url: string) => request<T>('delete', url)

  return {
    isLoading,
    error,
    get,
    post,
    put,
    delete: remove,
  }
}

export default useApi
