/**
 * POS Transactions Page
 * View and manage point of sale transactions
 */

<template>
  <div class="transactions-page">
    <div class="page-header">
      <div>
        <h2>POS Transactions</h2>
        <p class="text-gray-600">View sales transactions and history</p>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="filters-bar">
      <input v-model="startDate" type="date" class="filter-input" />
      <input v-model="endDate" type="date" class="filter-input" />
      <button class="btn-filter" @click="loadTransactions">Filter</button>
    </div>

    <!-- Summary Stats -->
    <div class="summary-grid">
      <div class="summary-card">
        <span class="card-label">Total Transactions</span>
        <span class="card-value">{{ recentPOSTransactions.length }}</span>
      </div>
      <div class="summary-card">
        <span class="card-label">Total Revenue</span>
        <span class="card-value">${{ totalRevenue.toFixed(2) }}</span>
      </div>
      <div class="summary-card">
        <span class="card-label">Average Transaction</span>
        <span class="card-value">${{ averageTransaction.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date & Time</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in recentPOSTransactions" :key="transaction.id">
            <td class="font-medium">{{ transaction.id }}</td>
            <td>{{ formatDateTime(transaction.transaction_date) }}</td>
            <td>{{ transaction.items?.length || 0 }} items</td>
            <td>${{ transaction.total_amount.toFixed(2) }}</td>
            <td>{{ transaction.payment_method }}</td>
            <td>
              <span class="badge badge-success">{{ transaction.status }}</span>
            </td>
            <td class="actions-cell">
              <button class="btn-sm btn-view" @click="viewTransaction(transaction)" title="View">
                <i class="fas fa-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="recentPOSTransactions.length === 0" class="empty-state">
        <i class="fas fa-receipt"></i>
        <h3>No transactions found</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import type { POSTransaction } from '@/types'
import { logger } from '@/utils/logger'

const { recentPOSTransactions, loadInitialData } = useInventoryData()

const startDate = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])

onMounted(async () => {
  await loadInitialData()
})

const totalRevenue = computed(() =>
  recentPOSTransactions.value.reduce((sum, t) => sum + t.total_amount, 0)
)

const averageTransaction = computed(() =>
  recentPOSTransactions.value.length > 0 ? totalRevenue.value / recentPOSTransactions.value.length : 0
)

const formatDateTime = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadTransactions = async () => {
  logger.info('Loading transactions', { startDate: startDate.value, endDate: endDate.value })
  await loadInitialData()
}

const viewTransaction = (transaction: POSTransaction) => {
  logger.debug('View transaction', { id: transaction.id })
}
</script>

<style scoped>
.transactions-page {
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

.filters-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.btn-filter {
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.btn-filter:hover {
  background-color: #2563eb;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.card-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.card-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background-color: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #1f2937;
  font-size: 13px;
}

.data-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.data-table tbody tr:hover {
  background-color: #f9fafb;
}

.data-table td {
  padding: 15px;
  color: #1f2937;
  font-size: 14px;
}

.font-medium {
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.actions-cell {
  display: flex;
  gap: 8px;
}

.btn-sm {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
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
  .filters-bar {
    flex-direction: column;
  }

  .filter-input {
    width: 100%;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
