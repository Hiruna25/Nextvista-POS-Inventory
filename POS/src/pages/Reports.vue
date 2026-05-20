/**
 * Reports & Analytics Page
 * View sales analytics, inventory trends, and business insights
 */

<template>
  <div class="reports-page">
    <div class="page-header">
      <h2>Reports & Analytics</h2>
      <p class="text-gray-600">Business insights and performance metrics</p>
    </div>

    <!-- Report Type Selector -->
    <div class="report-selector">
      <button
        v-for="report in reportTypes"
        :key="report"
        :class="['report-btn', { active: selectedReport === report }]"
        @click="selectedReport = report"
      >
        {{ report }}
      </button>
    </div>

    <!-- Sales Report -->
    <div v-if="selectedReport === 'Sales'" class="report-section">
      <h3>Sales Performance</h3>
      <div class="charts-grid">
        <div class="chart-container">
          <h4>Revenue Trend (Last 30 Days)</h4>
          <AnalyticsSection
            :inventory="inventory"
            :selected-branch="selectedBranch"
            :get-current-branch-stock="getCurrentBranchStock"
          />
        </div>
        <div class="chart-container">
          <h4>Top Selling Products</h4>
          <div class="data-list">
            <div v-for="idx in [1, 2, 3]" :key="idx" class="data-item">
              <span>Product {{ idx + 1 }}</span>
              <span class="value">${{ (Math.random() * 5000).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Inventory Report -->
    <div v-if="selectedReport === 'Inventory'" class="report-section">
      <h3>Inventory Analysis</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <span class="metric-label">Total SKUs</span>
          <span class="metric-value">{{ inventory.length }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Low Stock Items</span>
          <span class="metric-value warning">{{ lowStockCount }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Out of Stock</span>
          <span class="metric-value danger">{{ outOfStockCount }}</span>
        </div>
        <div class="metric-card">
          <span class="metric-label">Inventory Value</span>
          <span class="metric-value">${{ totalValue.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Supplier Report -->
    <div v-if="selectedReport === 'Suppliers'" class="report-section">
      <h3>Supplier Performance</h3>
      <div class="suppliers-list">
        <div v-for="supplier in suppliers" :key="supplier.id" class="supplier-item">
          <div class="supplier-info">
            <h4>{{ supplier.name }}</h4>
            <p>{{ supplier.email }} | {{ supplier.contact }}</p>
          </div>
          <div class="supplier-stats">
            <span>Orders: 12</span>
            <span>Total Spent: $5,400</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Options -->
    <div class="export-section">
      <h4>Export Report</h4>
      <div class="export-buttons">
        <button class="btn-export" @click="exportToCSV">
          <i class="fas fa-file-csv"></i> CSV
        </button>
        <button class="btn-export" @click="exportToPDF">
          <i class="fas fa-file-pdf"></i> PDF
        </button>
        <button class="btn-export" @click="printReport">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import { useStockCalculations } from '@/composables/useStockCalculations'
import AnalyticsSection from '@/components/features/AnalyticsSection.vue'
import { logger } from '@/utils/logger'

const { inventory, suppliers, loadInitialData } = useInventoryData()
const { getCurrentBranchStock } = useStockCalculations()

const reportTypes = ['Sales', 'Inventory', 'Suppliers']
const selectedReport = ref('Sales')
const selectedBranch = ref<number>(1)

onMounted(async () => {
  await loadInitialData()
})

const lowStockCount = computed(() =>
  inventory.value.filter(p => p.stock_quantity <= (p.min_stock_level || 10)).length
)

const outOfStockCount = computed(() =>
  inventory.value.filter(p => p.stock_quantity <= 0).length
)

const totalValue = computed(() =>
  inventory.value.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0)
)

const exportToCSV = () => {
  logger.info('Exporting to CSV', { report: selectedReport.value })
}

const exportToPDF = () => {
  logger.info('Exporting to PDF', { report: selectedReport.value })
}

const printReport = () => {
  window.print()
}
</script>

<style scoped>
.reports-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.report-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.report-btn {
  padding: 10px 20px;
  border: 2px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.report-btn:hover {
  border-color: #3b82f6;
}

.report-btn.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.report-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 25px;
}

.report-section h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #1f2937;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-container {
  background: #f9fafb;
  padding: 15px;
  border-radius: 6px;
}

.chart-container h4 {
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #1f2937;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.data-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
}

.data-item .value {
  font-weight: 600;
  color: #10b981;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.metric-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  font-weight: 600;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.metric-value.warning {
  color: #d97706;
}

.metric-value.danger {
  color: #ef4444;
}

.suppliers-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.supplier-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
}

.supplier-info h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.supplier-info p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.supplier-stats {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #1f2937;
}

.export-section {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.export-section h4 {
  margin: 0 0 15px 0;
  font-size: 16px;
}

.export-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-export {
  padding: 10px 20px;
  border: none;
  background-color: #10b981;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.btn-export:hover {
  background-color: #059669;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .report-selector {
    flex-wrap: wrap;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .supplier-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .supplier-stats {
    flex-direction: column;
  }
}

@media print {
  .report-selector,
  .export-section {
    display: none;
  }
}
</style>
