/**
 * Global Application Header
 * Professional NextPos header with branding, navigation, and actions
 */

<template>
  <header class="app-header">
    <!-- Top Header Bar -->
    <div class="header-top">
      <div class="header-container">
        <div class="header-left">
          <div class="logo-section">
            <div class="logo-icon">📦</div>
            <h1 class="app-title">NextPos</h1>
          </div>
          <p class="app-tagline">Advanced supermarket inventory management system</p>
        </div>

        <div class="header-center">
          <div class="branch-selector">
            <label for="branch">Select Branch:</label>
            <select id="branch" class="branch-select">
              <option>Main Branch</option>
              <option>Branch 2</option>
              <option>Branch 3</option>
            </select>
          </div>
        </div>

        <div class="header-right">
          <button class="btn btn-action btn-new-product">
            <span class="icon">✚</span>
            New Product
          </button>
          <button class="btn btn-action btn-suppliers">
            <span class="icon"></span>
            Suppliers
          </button>
          <button class="btn btn-action btn-export">
            <span class="icon">📤</span>
            Export
          </button>

          <div class="user-menu">
            <div class="user-avatar">{{ getUserInitials(user?.username) }}</div>
            <div class="user-info">
              <div class="user-details">
                <p class="username">{{ user?.username || 'Guest' }}</p>
                <p class="user-role">{{ user?.roles?.[0] || 'User' }}</p>
              </div>
            </div>
            <button @click="handleLogout" class="btn-logout" title="Logout">
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="header-nav">
      <div class="nav-container">
        <router-link
          to="/dashboard"
          class="nav-link"
          active-class="active"
        >
          <span class="icon">📊</span>
          Dashboard
        </router-link>
        <router-link
          to="/inventory"
          class="nav-link"
          active-class="active"
        >
          <span class="icon">📦</span>
          Inventory
        </router-link>
        <router-link
          to="/analytics"
          class="nav-link"
          active-class="active"
        >
          <span class="icon">📈</span>
          Analytics
        </router-link>
        <router-link
          to="/replenishment"
          class="nav-link"
          active-class="active"
        >
          <span class="icon">🔄</span>
          Replenishment
        </router-link>
        <router-link
          to="/reports"
          class="nav-link"
          active-class="active"
        >
          <span class="icon">📋</span>
          Reports
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAppStore } from '@/stores/app'
import { logger } from '@/utils/logger'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const user = computed(() => authStore.user)

const getUserInitials = (username?: string): string => {
  if (!username) return 'U'
  return username
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    appStore.addNotification('Logged out successfully', 'info')
    logger.info('User logged out successfully')
    
    // Wait for reactive state to update before navigating
    await nextTick()
    await router.replace({ name: 'Login' })
    logger.debug('Redirected to login page')
  } catch (navError) {
    logger.error('Navigation failed, using window location', navError)
    window.location.href = '/login'
  }
}
</script>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.username {
  margin: 0;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  text-transform: capitalize;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-logout:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .header-container {
    padding: 12px 16px;
  }

  .app-title {
    font-size: 18px;
  }

  .user-details {
    display: none;
  }

  .header-right {
    gap: 12px;
  }

  .btn-logout span {
    display: none;
  }

  .btn-logout {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
