/**
 * Global Error Boundary Component
 * Catches and displays Vue errors globally
 */

<template>
  <div class="error-boundary" v-if="hasError">
    <div class="error-container">
      <div class="error-header">
        <h1>⚠️ Something went wrong</h1>
        <button @click="resetError" class="close-btn">×</button>
      </div>

      <div class="error-content">
        <p class="error-message">{{ errorMessage }}</p>

        <details v-if="isDev" class="error-details">
          <summary>Error Details (Development Only)</summary>
          <pre>{{ errorStack }}</pre>
        </details>

        <div class="error-actions">
          <button @click="resetError" class="btn btn-primary">Try Again</button>
          <router-link to="/" class="btn btn-secondary">Go to Dashboard</router-link>
        </div>
      </div>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, computed, onErrorCaptured } from 'vue'
import { logger } from '@/utils/logger'

const hasError = ref(false)
const error = ref<Error | null>(null)
const isDev = computed(() => import.meta.env.DEV)

const errorMessage = computed(() => {
  if (!error.value) return 'An unknown error occurred. Please try again.'
  return error.value.message || 'An unknown error occurred. Please try again.'
})

const errorStack = computed(() => {
  if (!error.value) return ''
  return error.value.stack || error.value.message
})

const resetError = () => {
  hasError.value = false
  error.value = null
}

onErrorCaptured((err: unknown) => {
  hasError.value = true
  error.value = err instanceof Error ? err : new Error(String(err))
  logger.error('Error captured by boundary', {
    message: errorMessage.value,
    stack: errorStack.value,
  })

  // Prevent error from propagating further
  return false
})
</script>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.error-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.error-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.error-header h1 {
  margin: 0;
  font-size: 24px;
  color: #f81d7a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: #e0e0e0;
}

.error-content {
  padding: 24px;
}

.error-message {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
  line-height: 1.6;
}

.error-details {
  margin: 16px 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 6px;
  border-left: 3px solid #ff6b6b;
}

.error-details summary {
  cursor: pointer;
  font-weight: 600;
  color: #ff6b6b;
  user-select: none;
}

.error-details pre {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #222;
  color: #0f0;
  font-size: 12px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.error-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e8e8e8;
}

@media (max-width: 600px) {
  .error-header h1 {
    font-size: 20px;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
