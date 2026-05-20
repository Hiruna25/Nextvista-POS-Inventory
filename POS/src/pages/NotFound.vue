/**
 * Not Found Page
 * 404 error page
 */

<template>
  <div class="not-found">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <router-link to="/" class="btn btn-primary">Go to Dashboard</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { logger } from '@/utils/logger'

onMounted(() => {
  logger.warn('404 page accessed')
})
</script>

<style scoped>
.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
}

.not-found-container {
  text-align: center;
  color: white;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 20px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 48px;
  margin: 0 0 16px 0;
  font-weight: 600;
}

p {
  font-size: 18px;
  margin: 0 0 32px 0;
  opacity: 0.9;
}

.btn {
  display: inline-block;
  padding: 12px 32px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 480px) {
  .error-code {
    font-size: 80px;
  }

  h1 {
    font-size: 32px;
  }

  p {
    font-size: 16px;
  }
}
</style>
