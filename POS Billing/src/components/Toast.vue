<template>
  <div v-if="toast.show" class="toast" :class="toast.type">
    {{ toast.message }}
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    toast: {
      type: Object,
      default: () => ({
        show: false,
        message: '',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
:root {
  --success: #10B981;
  --danger: #EF4444;
  --warning: #F59E0B;
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.08);
  --radius: 12px;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 14px 20px;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.85rem;
  z-index: 200;
  animation: slideInRight 0.3s ease;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast.success {
  background: var(--success);
  color: #fff;
}

.toast.error {
  background: var(--danger);
  color: #fff;
}

.toast.warning {
  background: var(--warning);
  color: #1e293b;
}

@keyframes slideInRight {
  from {
    transform: translateX(120%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
