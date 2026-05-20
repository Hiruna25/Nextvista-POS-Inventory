/**
 * Login Page
 * User authentication interface
 */

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>POS Inventory System</h1>
        <p>Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            placeholder="Enter your username"
            class="form-input"
            :disabled="isLoading"
            autocomplete="username"
          />
          <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            class="form-input"
            :disabled="isLoading"
            autocomplete="current-password"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div v-if="errors._general" class="form-error">
          {{ errors._general }}
        </div>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <div class="login-footer">
        <p class="demo-info">
          Demo: username: <strong>Admin</strong> | password: <strong>Admin123</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { useAnalytics } from '@/composables/useAnalyticsComposable'
import { validateSchema, LoginSchema } from '@/schemas/validation'
import { logger } from '@/utils/logger'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const { trackUserLogin } = useAnalytics()

const isLoading = ref(false)
const formData = reactive({
  username: '',
  password: '',
})
const errors = reactive({
  username: '',
  password: '',
  _general: '',
})

const handleLogin = async () => {
  // Clear previous errors
  errors.username = ''
  errors.password = ''
  errors._general = ''

  // Validate input
  const validation = await validateSchema(LoginSchema, formData)
  if (!validation.success && validation.errors) {
    Object.assign(errors, validation.errors)
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.login(formData)

    if (success) {
      trackUserLogin(formData.username)
      logger.success('Login successful', { username: formData.username })

      // Redirect to dashboard or intended page
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    } else {
      errors._general = authStore.error || 'Login failed. Please try again.'
      appStore.addNotification(errors._general, 'error')
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred during login'
    errors._general = message
    appStore.addNotification(message, 'error')
    logger.error('Login error', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
  font-weight: 600;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.error-text {
  color: #f81d7a;
  font-size: 12px;
  font-weight: 500;
}

.form-error {
  padding: 12px 16px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c00;
  font-size: 14px;
  font-weight: 500;
}

.btn {
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  text-align: center;
}

.demo-info {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>
