import { ref } from 'vue'
import type { Notification } from '@/types'

const notification = ref<Notification>({
  show: false,
  message: '',
  type: 'info',
  icon: 'fas fa-info-circle'
})

let notificationTimeout: ReturnType<typeof setTimeout>

export function useNotification() {
  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string
  ) => {
    if (notificationTimeout) {
      clearTimeout(notificationTimeout)
    }

    notification.value = {
      show: true,
      message,
      type,
      icon:
        type === 'success'
          ? 'fas fa-check-circle'
          : type === 'error'
            ? 'fas fa-exclamation-circle'
            : type === 'warning'
              ? 'fas fa-exclamation-triangle'
              : 'fas fa-info-circle'
    }

    notificationTimeout = setTimeout(() => {
      hideNotification()
    }, 5000)
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}
