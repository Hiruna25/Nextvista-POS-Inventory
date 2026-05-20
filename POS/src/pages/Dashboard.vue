/**
 * Dashboard Page
 * Main application interface
 */

<template>
  <div class="dashboard-wrapper">
    <Header />
    <main class="dashboard-main">
      <div class="dashboard-content">
        <section class="page-header">
          <h1>Dashboard Overview</h1>
          <p>Monitor your inventory at a glance</p>
        </section>

        <section class="summary-grid">
          <SummaryCard
            :value="totalProducts"
            :trend="trend.products"
            :config="{ title: 'Total Products', class: '', icon: 'fas fa-boxes' }"
          />
          <SummaryCard
            :value="lowStockCount"
            :trend="trend.lowStock"
            :config="{ title: 'Low Stock Alert', class: 'warning', icon: 'fas fa-exclamation-triangle' }"
          />
          <SummaryCard
            :value="outOfStockCount"
            :trend="trend.outOfStock"
            :config="{ title: 'Out of Stock', class: 'danger', icon: 'fas fa-times-circle' }"
          />
          <SummaryCard
            :value="formattedInventoryValue"
            :trend="trend.value"
            :config="{ title: 'Total Inventory Value', class: 'success', icon: 'fas fa-dollar-sign' }"
          />
          <SummaryCard
            :value="averageStockDays"
            :trend="trend.stockDays"
            :config="{ title: 'Avg. Stock Days', class: 'info', icon: 'fas fa-calendar' }"
          />
          <SummaryCard
            :value="inventoryTurnoverRate"
            :trend="trend.turnover"
            :config="{ title: 'Inventory Turnover', class: '', icon: 'fas fa-sync-alt' }"
          />
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAnalytics } from '@/composables/useAnalyticsComposable'
import { useInventoryData } from '@/composables/useInventoryData'
import { logger } from '@/utils/logger'
import Header from '@/components/shared/Header.vue'
import SummaryCard from '@/components/dashboard/SummaryCard.vue'

const authStore = useAuthStore()
const { trackPageView } = useAnalytics()
const { inventory, loadInitialData } = useInventoryData()

const user = computed(() => authStore.user)

const totalProducts = computed(() => inventory.value.length)
const lowStockCount = computed(() =>
  inventory.value.filter((item) => item.stock_quantity <= (item.lowStockThreshold ?? item.min_stock_level ?? 10)).length
)
const outOfStockCount = computed(() => inventory.value.filter((item) => item.stock_quantity <= 0).length)
const totalInventoryValue = computed(() =>
  inventory.value.reduce((sum, item) => sum + item.price * (item.stock_quantity ?? 0), 0)
)
const formattedInventoryValue = computed(() =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalInventoryValue.value)
)
const averageStockDays = computed(() => {
  if (inventory.value.length === 0) return '0.0'
  const totalDays = inventory.value.reduce((sum, item) => {
    const dailySales = item.dailySales ?? 2
    return sum + (dailySales > 0 ? (item.stock_quantity ?? 0) / dailySales : 0)
  }, 0)
  return (totalDays / inventory.value.length).toFixed(1)
})
const inventoryTurnoverRate = computed(() => {
  if (totalInventoryValue.value === 0) return '0.00'
  const totalCost = inventory.value.reduce((sum, item) => sum + (item.cost ?? 0) * (item.stock_quantity ?? 0), 0)
  return ((totalCost / totalInventoryValue.value) * 100).toFixed(2)
})

const trend = ref({
  products: 14,
  lowStock: 18,
  outOfStock: 7,
  value: -3,
  stockDays: -3,
  turnover: 4,
})

onMounted(async () => {
  await loadInitialData()
  trackPageView('Dashboard', '/dashboard')
  logger.info('Dashboard mounted', { user: user.value?.username })
})
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f5f5;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
}

.dashboard-content {
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 32px;
  color: #1f2937;
  font-weight: 700;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

@media (max-width: 900px) {
  .dashboard-main {
    padding: 16px;
  }

  .page-header h1 {
    font-size: 28px;
  }
}

@media (max-width: 680px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>

