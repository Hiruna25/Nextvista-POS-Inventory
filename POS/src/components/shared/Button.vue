<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      { 'btn-sm': size === 'sm' },
      { 'btn-lg': size === 'lg' }
    ]"
    :disabled="disabled"
  >
    <i v-if="icon" :class="icon"></i>
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'info' | 'warning' | 'dark' | 'edit' | 'stock' | 'cancel'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md'
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  letter-spacing: 0.3px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-sm {
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
}

.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #7b8ffa 0%, #8052b0 100%);
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn-success {
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: linear-gradient(135deg, #16a085 0%, #138d75 100%);
}

.btn-danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #cb2c20 0%, #a93226 100%);
}

.btn-warning {
  background: linear-gradient(135deg, #f39c12 0%, #d68910 100%);
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #e8860e 0%, #ba6e0b 100%);
}

.btn-info {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
}

.btn-dark {
  background-color: #2c3e50;
  color: white;
}

.btn-dark:hover:not(:disabled) {
  background-color: #1a252f;
}

.btn-edit {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  color: white;
}

.btn-edit:hover:not(:disabled) {
  background: linear-gradient(135deg, #2980b9 0%, #1f618d 100%);
}

.btn-stock {
  background: linear-gradient(135deg, #e67e22 0%, #d35400 100%);
  color: white;
}

.btn-stock:hover:not(:disabled) {
  background: linear-gradient(135deg, #d35400 0%, #a04000 100%);
}

.btn-cancel {
  background-color: #95a5a6;
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #7f8c8d;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Icons styling */
.btn i {
  font-size: 14px;
}

.btn-sm i {
  font-size: 12px;
}

.btn-lg i {
  font-size: 16px;
}
</style>
