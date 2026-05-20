/**
 * Supplier Orders Page
 * Manage supplier orders and purchase tracking
 */

<template>
  <div class="orders-page">
    <div class="page-header">
      <div>
        <h2>Supplier Orders</h2>
        <p class="text-gray-600">Track and manage supplier orders</p>
      </div>
      <button class="btn-primary" @click="showNewOrderModal = true">
        <i class="fas fa-plus"></i> New Order
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <select v-model="statusFilter" class="filter-input">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
      <select v-model="supplierFilter" class="filter-input">
        <option value="">All Suppliers</option>
        <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
          {{ sup.name }}
        </option>
      </select>
    </div>

    <!-- Orders Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Supplier</th>
            <th>Order Date</th>
            <th>Expected Delivery</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="font-medium">{{ order.id }}</td>
            <td>{{ getSupplierName(order.supplier_id, suppliers) }}</td>
            <td>{{ formatDate(order.order_date) }}</td>
            <td>{{ order.expected_date ? formatDate(order.expected_date) : 'N/A' }}</td>
            <td>
              <span :class="getStatusBadgeClass(order.status)">
                {{ order.status }}
              </span>
            </td>
            <td>${{ order.total_amount?.toFixed(2) || '0.00' }}</td>
            <td class="actions-cell">
              <button class="btn-sm btn-view" @click="viewOrder(order)" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button v-if="order.status !== 'delivered'" class="btn-sm btn-edit" @click="editOrder(order)" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredOrders.length === 0" class="empty-state">
        <i class="fas fa-inbox"></i>
        <h3>No orders found</h3>
      </div>
    </div>

    <!-- Order Modal -->
    <div v-if="showNewOrderModal" class="modal-overlay" @click.self="showNewOrderModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Create New Order</h2>
          <button class="btn-close" @click="showNewOrderModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Supplier</label>
            <select v-model="newOrder.supplier_id" class="form-input">
              <option value="">Select Supplier</option>
              <option v-for="sup in suppliers" :key="sup.id" :value="sup.id">
                {{ sup.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Expected Delivery Date</label>
            <input v-model="newOrder.expected_delivery_date" type="date" class="form-input" />
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" @click="showNewOrderModal = false">Cancel</button>
            <button class="btn-submit" @click="createOrder">Create Order</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryData } from '@/composables/useInventoryData'
import { getSupplierName } from '@/utils/helpers'
import type { SupplierOrder } from '@/types'
import { logger } from '@/utils/logger'

const { suppliers, supplierOrders, loadInitialData } = useInventoryData()

const statusFilter = ref('')
const supplierFilter = ref<string | number>('')
const showNewOrderModal = ref(false)
const newOrder = ref({
  supplier_id: '',
  expected_delivery_date: ''
})

onMounted(async () => {
  await loadInitialData()
})

const filteredOrders = computed(() => {
  let filtered = supplierOrders.value

  if (statusFilter.value) {
    filtered = filtered.filter(o => o.status === statusFilter.value)
  }

  if (supplierFilter.value) {
    filtered = filtered.filter(o => o.supplier_id === supplierFilter.value)
  }

  return filtered.sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
})

const getStatusBadgeClass = (status: string) => {
  const baseClass = 'badge'
  const statusMap: { [key: string]: string } = {
    pending: 'badge-warning',
    confirmed: 'badge-info',
    shipped: 'badge-primary',
    delivered: 'badge-success'
  }
  return `${baseClass} ${statusMap[status] || 'badge-default'}`
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const viewOrder = (order: SupplierOrder) => {
  logger.debug('View order', { id: order.id })
}

const editOrder = (order: SupplierOrder) => {
  logger.debug('Edit order', { id: order.id })
}

const createOrder = async () => {
  try {
    logger.info('Order created', newOrder.value)
    showNewOrderModal.value = false
  } catch (error) {
    logger.error('Error creating order', error)
  }
}
</script>

<style scoped>
.orders-page {
  animation: fadeIn 0.3s ease-in;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-header h2 {
  margin: 0 0 5px 0;
  font-size: 28px;
  color: #1f2937;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.filters-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.filter-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  min-width: 150px;
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

.badge-warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.badge-info {
  background-color: rgba(6, 182, 212, 0.1);
  color: #0891b2;
}

.badge-primary {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
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
  transition: all 0.2s ease;
}

.btn-view {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.btn-edit {
  background-color: rgba(34, 197, 94, 0.1);
  color: #22c55e;
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
}

.btn-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #6b7280;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  font-size: 14px;
}

.btn-submit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #3b82f6;
  color: white;
  cursor: pointer;
  font-size: 14px;
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
  .page-header {
    flex-direction: column;
    gap: 15px;
  }

  .filters-bar {
    flex-direction: column;
  }

  .filter-input {
    min-width: auto;
  }
}
</style>
