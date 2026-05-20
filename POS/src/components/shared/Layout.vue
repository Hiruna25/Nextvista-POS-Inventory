/**
 * Main Layout Component
 * Provides sidebar navigation, header, and content area
 */

<template>
  <div class="app-layout">
    <!-- Sidebar Navigation -->
    <aside class="sidebar" :class="{ 'sidebar-mobile': isMobileMenuOpen }">
      <div class="sidebar-header">
        <div class="logo">
          <i class="fas fa-store"></i>
          <span>NextPos</span>
        </div>
        <button v-if="isMobile" class="mobile-close" @click="isMobileMenuOpen = false">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="sidebar-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.id"
          :to="item.path"
          class="menu-item"
          :class="{ 'menu-item-active': isActive(item.path) }"
          @click="isMobileMenuOpen = false"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="badge">{{ item.badge }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Header -->
      <header class="header">
        <button v-if="isMobile" class="mobile-menu-btn" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <i class="fas fa-bars"></i>
        </button>

        <div class="header-title">
          <h1>{{ currentPageTitle }}</h1>
        </div>

        <div class="header-actions">
          <button class="search-btn" @click="showSearch = !showSearch">
            <i class="fas fa-search"></i>
          </button>
          <div class="user-menu">
            <button class="user-btn" @click="showUserMenu = !showUserMenu">
              <span class="user-avatar">{{ userInitial }}</span>
              <span class="user-name">{{ authStore.user?.username }}</span>
              <i class="fas fa-chevron-down"></i>
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <a href="#" @click.prevent="() => {}">Profile</a>
              <a href="#" @click.prevent="() => {}">Settings</a>
              <hr />
              <a href="#" @click.prevent="handleLogout">Logout</a>
            </div>
          </div>
        </div>
      </header>

      <!-- Search Bar -->
      <div v-if="showSearch" class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products, suppliers, orders..."
          class="search-input"
          @keyup.enter="performSearch"
        />
      </div>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { logger } from '@/utils/logger'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isMobile = ref(window.innerWidth < 768)
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const showSearch = ref(false)
const searchQuery = ref('')

// Responsive handling
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})

interface MenuItem {
  id: number
  label: string
  path: string
  icon: string
  badge?: number | null
}

const menuItems = computed(() => {
  const items: MenuItem[] = [
    { id: 1, label: 'Dashboard', path: '/dashboard', icon: 'fas fa-chart-line' },
    { id: 2, label: 'Products', path: '/products', icon: 'fas fa-boxes' },
    { id: 3, label: 'Inventory', path: '/inventory', icon: 'fas fa-warehouse' },
    { id: 4, label: 'Suppliers', path: '/suppliers', icon: 'fas fa-truck' },
    { id: 5, label: 'Orders', path: '/supplier-orders', icon: 'fas fa-file-invoice' },
    { id: 6, label: 'Transactions', path: '/transactions', icon: 'fas fa-cash-register' },
    { id: 7, label: 'Reports', path: '/reports', icon: 'fas fa-chart-bar' },
  ]

  // Add admin-only items
  if (authStore.user?.roles?.includes('admin')) {
    items.push({ id: 8, label: 'Users', path: '/users', icon: 'fas fa-users', badge: null })
    items.push({ id: 9, label: 'Settings', path: '/settings', icon: 'fas fa-cog', badge: null })
  }

  return items
})

const currentPageTitle = computed(() => {
  const item = menuItems.value.find(m => m.path === route.path)
  return item?.label || 'Dashboard'
})

const userInitial = computed(() => {
  return (authStore.user?.username?.[0] || 'U').toUpperCase()
})

const isActive = (path: string) => {
  return route.path === path
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    // Wait for reactive state to update before navigating
    await nextTick()
    router.push('/login')
  } catch (error) {
    logger.error('Logout error', error)
  }
}

const performSearch = () => {
  logger.info('Search performed', { query: searchQuery.value })
  // TODO: Implement global search
}
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #1f2937;
  color: #f3f4f6;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(243, 244, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
}

.logo i {
  font-size: 24px;
  color: #3b82f6;
}

.mobile-close {
  display: none;
  background: none;
  border: none;
  color: #f3f4f6;
  font-size: 20px;
  cursor: pointer;
}

.sidebar-menu {
  flex: 1;
  padding: 15px 0;
  overflow-y: auto;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #d1d5db;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  font-size: 14px;
}

.menu-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #f3f4f6;
  padding-left: 24px;
}

.menu-item-active {
  background-color: rgba(59, 130, 246, 0.2);
  border-left-color: #3b82f6;
  color: #3b82f6;
}

.menu-item i {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.badge {
  margin-left: auto;
  background-color: #ef4444;
  color: white;
  border-radius: 12px;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 600;
}

.sidebar-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(243, 244, 246, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  border: none;
  color: #d1d5db;
  padding: 10px 0;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 14px;
}

.logout-btn:hover {
  color: #ef4444;
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px;
  overflow: hidden;
}

/* Header */
.header {
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 70px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #1f2937;
}

.header-title h1 {
  margin: 0;
  font-size: 24px;
  color: #1f2937;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.search-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.3s ease;
}

.search-btn:hover {
  color: #1f2937;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 0;
  color: #1f2937;
  font-size: 14px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 160px;
  margin-top: 10px;
}

.dropdown-menu a {
  display: block;
  padding: 10px 15px;
  color: #1f2937;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.dropdown-menu a:hover {
  background-color: #f3f4f6;
}

.dropdown-menu a:first-child {
  border-radius: 8px 8px 0 0;
}

.dropdown-menu hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

/* Search Bar */
.search-bar {
  padding: 15px 30px;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar-mobile {
    transform: translateX(0);
  }

  .mobile-close {
    display: block;
  }

  .main-wrapper {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .header {
    padding: 10px 15px;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-actions {
    gap: 10px;
    margin-left: auto;
  }

  .user-name {
    display: none;
  }

  .main-content {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    z-index: 999;
  }

  .header {
    flex-wrap: wrap;
  }

  .header-title {
    width: 100%;
  }

  .header-title h1 {
    font-size: 16px;
  }
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
