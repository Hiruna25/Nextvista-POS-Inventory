<template>
  <Teleport to="body">
    <Transition name="slideIn">
      <div v-if="notification.show" :class="['notification', `notification-${notification.type}`]">
        <i :class="notification.icon"></i>
        <span>{{ notification.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'

const { notification } = useNotification()
</script>

<style scoped>
.notification {
  position: fixed;
  top: 30px;
  right: 30px;
  padding: 16px 22px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  z-index: 9999;
  max-width: 450px;
  word-wrap: break-word;
  border-left: 4px solid;
  backdrop-filter: blur(10px);
  animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(450px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(450px);
    opacity: 0;
  }
}

.notification-success {
  background: linear-gradient(135deg, rgba(46, 204, 113, 0.95) 0%, rgba(39, 174, 96, 0.95) 100%);
  color: white;
  border-left-color: #2ecc71;
}

.notification-success i {
  font-size: 18px;
  color: #fff;
}

.notification-error {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.95) 0%, rgba(192, 57, 43, 0.95) 100%);
  color: white;
  border-left-color: #e74c3c;
}

.notification-error i {
  font-size: 18px;
  color: #fff;
}

.notification-warning {
  background: linear-gradient(135deg, rgba(243, 156, 18, 0.95) 0%, rgba(230, 126, 34, 0.95) 100%);
  color: white;
  border-left-color: #f39c12;
}

.notification-warning i {
  font-size: 18px;
  color: #fff;
}

.notification-info {
  background: linear-gradient(135deg, rgba(52, 152, 219, 0.95) 0%, rgba(41, 128, 185, 0.95) 100%);
  color: white;
  border-left-color: #3498db;
}

.notification-info i {
  font-size: 18px;
  color: #fff;
}

.slideIn-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slideIn-leave-active {
  animation: slideOutRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@media (max-width: 768px) {
  .notification {
    top: 20px;
    right: 20px;
    left: 20px;
    max-width: none;
    border-radius: 8px;
  }
}
</style>
